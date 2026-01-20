import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  StreamVideo, 
  StreamVideoClient, 
  StreamCall, 
  StreamTheme,
  SpeakerLayout, // <--- CHANGED FROM PaginatedGridLayout
  CallControls,
  useCallStateHooks
} from '@stream-io/video-react-sdk';
import { 
  Chat, 
  Channel, 
  Window, 
  MessageList, 
  MessageInput, 
  useCreateChatClient 
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'stream-chat-react/dist/css/v2/index.css'; 
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { FaExclamationTriangle, FaDesktop, FaPen, FaComments } from "react-icons/fa";

// === MONITOR COMPONENT ===
const RoomMonitor = ({ isTeacher }) => {
  const { useIsCallRecordingInProgress, useScreenShareState } = useCallStateHooks();
  const isRecording = useIsCallRecordingInProgress();
  const { isScreenSharing } = useScreenShareState();

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full px-4 pointer-events-none">
      {isRecording ? (
        <div className="bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg backdrop-blur-md">
          ● REC
        </div>
      ) : (
        <div className="bg-yellow-500/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
           ⚠ REC PAUSED
        </div>
      )}

      {/* Only show this warning if Teacher is NOT sharing screen */}
      {isTeacher && !isScreenSharing && (
        <div className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-2xl flex items-center gap-3 animate-bounce">
           <FaExclamationTriangle className="text-xl" />
           <span>STUDENTS SEE VIDEO ONLY. CLICK "SHARE SCREEN" TO SHOW BOARD.</span>
        </div>
      )}
    </div>
  );
};

export default function LiveRoom() {
  const { userData } = useSelector((state) => state.user);
  const { meetingId } = useParams();
  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [showChat, setShowChat] = useState(true);
  
  const navigate = useNavigate();

  // === FIXED SCREEN SHARE VIEW ===
  const ScreenShareToggle = ({ isTeacher }) => {
    const { useScreenShareState } = useCallStateHooks();
    const { isScreenSharing } = useScreenShareState(); // This detects LOCAL share
    
    // Logic: If I am the teacher and I am NOT sharing, show me the Whiteboard.
    // Otherwise (if I am sharing, OR if I am a student), show the Stream Video.
    const showWhiteboard = isTeacher && !isScreenSharing;

    return (
      <div className="flex-1 relative bg-black overflow-hidden">
        {showWhiteboard ? (
          <div className="absolute inset-0 z-0">
             <Tldraw />
          </div>
        ) : (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
             {/* SpeakerLayout automatically prioritizes Screen Share over Camera */}
             <SpeakerLayout participantsBarPosition="bottom" />
          </div>
        )}
        
        {isTeacher && (
            <div className="absolute top-4 left-4 z-20 bg-slate-800/80 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                {showWhiteboard ? <><FaPen /> WHITEBOARD MODE</> : <><FaDesktop /> SCREEN SHARE MODE</>}
            </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!userData) return;

    const initClients = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/live/get-token`, { withCredentials: true });
        
        const user = {
          id: userData._id,
          name: userData.name,
          image: userData.photoUrl,
        };

        const apiKey = data.apiKey;
        const token = data.token;

        // 1. Setup Video Client
        const vClient = new StreamVideoClient({ apiKey, user, token });
        const myCall = vClient.call('default', meetingId);
        await myCall.join({ create: true });

        // LISTENER: Kick everyone out when call ends
        myCall.on('call.ended', () => {
            toast.info("Class Ended by Instructor");
            navigate('/live-schedule');
        });

        // Auto-Record for Teacher
        if (userData.role === 'educator') {
            try {
                const state = await myCall.get();
                if(!state.call.recording) {
                    await myCall.startRecording();
                    toast.success("Recording Started");
                }
            } catch (err) { console.log("Rec start error:", err); }
        }

        setVideoClient(vClient);
        setCall(myCall);

        // 2. Setup Chat Client
        const cClient = StreamChat.getInstance(apiKey);
        await cClient.connectUser(user, token);
        
        const myChannel = cClient.channel('livestream', meetingId, {
            name: `Live Class: ${meetingId}`,
            members: [userData._id]
        });
        await myChannel.watch();
        
        setChatClient(cClient);
        setChannel(myChannel);

      } catch (error) {
        console.error(error);
        toast.error("Failed to join live class");
        navigate(-1);
      }
    };

    initClients();

    return () => {
      if (videoClient) videoClient.disconnectUser();
      if (chatClient) chatClient.disconnectUser();
    };
  }, [meetingId, userData]);

  const handleEndClass = async () => {
    if(!window.confirm("End class for everyone?")) return;
    try {
      try {
         const state = await call.get();
         if(state.call.recording) await call.stopRecording();
      } catch (e) { console.warn("Rec stop warn:", e); }
      
      await axios.post(`${serverUrl}/api/live/end`, { meetingId }, { withCredentials: true });
      if (call) await call.endCall(); // Triggers call.ended event
      
      toast.success("Class Ended");
      navigate('/live-schedule'); 
    } catch (error) {
      toast.error("Error ending class");
    }
  };

  if (!videoClient || !call || !chatClient || !channel) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Loading Class & Chat...</div>;

  const isTeacher = userData.role === 'educator';

  return (
    <StreamVideo client={videoClient}>
      <StreamTheme>
        <StreamCall call={call}>
          <div className="flex flex-col h-screen w-screen bg-slate-900 overflow-hidden relative">
            <RoomMonitor isTeacher={isTeacher} />
            
            {/* TOP BAR */}
            <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 z-50">
               <div className="flex items-center gap-4">
                  <span className="text-white font-bold tracking-wide">🔴 Live Class</span>
                  <button onClick={() => setShowChat(!showChat)} className="text-white bg-slate-700 px-3 py-1 rounded text-sm flex items-center gap-2 hover:bg-slate-600">
                     <FaComments /> {showChat ? "Hide Chat" : "Show Chat"}
                  </button>
               </div>
               
               {isTeacher ? (
                  <button onClick={handleEndClass} className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded-lg font-bold text-sm shadow-lg">End Class</button>
               ) : (
                  <button onClick={() => navigate('/live-schedule')} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm">Leave</button>
               )}
            </div>

            {/* MAIN LAYOUT: Video Left | Chat Right */}
            <div className="flex flex-1 overflow-hidden">
                <ScreenShareToggle isTeacher={isTeacher} />
                
                {/* CHAT SIDEBAR */}
                {showChat && (
                    <div className="w-[350px] bg-white border-l border-slate-700 flex flex-col z-40">
                         <Chat client={chatClient} theme="messaging light">
                            <Channel channel={channel}>
                                <Window>
                                    <div className="p-3 bg-slate-100 border-b font-bold text-slate-700 shadow-sm">Live Chat</div>
                                    <MessageList />
                                    <MessageInput focus />
                                </Window>
                            </Channel>
                         </Chat>
                    </div>
                )}
            </div>

            <div className="bg-slate-900 border-t border-slate-800 p-4 flex justify-center z-50">
                <CallControls />
            </div>
          </div>
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
}




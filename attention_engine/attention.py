import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

FACE_DETECTOR_MODEL = "models/face_detector.tflite"
FACE_LANDMARK_MODEL = "models/face_landmarker.task"

base_fd = python.BaseOptions(model_asset_path=FACE_DETECTOR_MODEL)
fd_options = vision.FaceDetectorOptions(
    base_options=base_fd,
    running_mode=vision.RunningMode.IMAGE,
    min_detection_confidence=0.5
)
face_detector = vision.FaceDetector.create_from_options(fd_options)

base_fl = python.BaseOptions(model_asset_path=FACE_LANDMARK_MODEL)
fl_options = vision.FaceLandmarkerOptions(
    base_options=base_fl,
    running_mode=vision.RunningMode.IMAGE,
    num_faces=1
)
face_landmarker = vision.FaceLandmarker.create_from_options(fl_options)


def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


def analyze_frame(frame):
    if frame is None:
        return {"face_conf": 0.0, "gaze_conf": 0.0, "head_conf": 0.0}

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    mp_image = mp.Image(
        image_format=mp.ImageFormat.SRGB,
        data=rgb
    )

    detection = face_detector.detect(mp_image)
    if not detection.detections:
        return {"face_conf": 0.0, "gaze_conf": 0.0, "head_conf": 0.0}

    face_conf = float(detection.detections[0].categories[0].score)

    landmarks_result = face_landmarker.detect(mp_image)
    if not landmarks_result.face_landmarks:
        return {
            "face_conf": round(face_conf, 3),
            "gaze_conf": 0.0,
            "head_conf": 0.0
        }

    lm = landmarks_result.face_landmarks[0]

    left_eye = lm[33]
    right_eye = lm[263]
    nose = lm[1]

    eye_center_x = (left_eye.x + right_eye.x) / 2.0
    gaze_conf = clamp(1.0 - abs(eye_center_x - 0.5) * 2.2)

    nose_offset = abs(nose.x - eye_center_x)
    head_conf = clamp(1.0 - (nose_offset * 4.5))

    return {
        "face_conf": round(face_conf, 3),
        "gaze_conf": round(gaze_conf, 3),
        "head_conf": round(head_conf, 3)
    }
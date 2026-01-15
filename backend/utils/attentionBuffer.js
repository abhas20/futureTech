const buffers = new Map();

export const pushSignal = (userId, signal) => {
  if (!buffers.has(userId)) {
    buffers.set(userId, {
      samples: [],
      calibrated: false,
      baseline: null,
    });
  }

  const buf = buffers.get(userId);
  buf.samples.push(signal);

  if (buf.samples.length > 20) buf.samples.shift();
};

export const getAttention = (userId) => {
  const buf = buffers.get(userId);
  if (!buf || buf.samples.length < 10) {
    return {
      calibrated: false,
      samples: buf?.samples.length || 0,
    };
  }

  if (!buf.calibrated) {
    buf.calibrated = true;
    buf.baseline = average(buf.samples);
    return { calibrated: true, message: "Calibration complete" };
  }

  const current = average(buf.samples);
  const score =
    (current.face + current.gaze + current.head) / 3;

  return {
    calibrated: true,
    attention: Math.round(score * 100),
    state: score > 0.6 ? "ATTENTIVE" : "NOT_ATTENTIVE",
  };
};

const average = (samples) => {
  const sum = samples.reduce(
    (a, s) => ({
      face: a.face + s.face_conf,
      gaze: a.gaze + s.gaze_conf,
      head: a.head + s.head_conf,
    }),
    { face: 0, gaze: 0, head: 0 }
  );

  return {
    face: sum.face / samples.length,
    gaze: sum.gaze / samples.length,
    head: sum.head / samples.length,
  };
};
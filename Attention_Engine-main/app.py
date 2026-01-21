from flask import Flask, request, jsonify
import numpy as np
import cv2
import os
from attention import analyze_frame

app = Flask(__name__)

@app.route("/")
def index():
    return "Attention Engine is running."

@app.route("/analyze", methods=["POST"])
def analyze():
    print("FILES:", request.files)

    if "frame" not in request.files:
        return jsonify({"error": "No frame provided"}), 400

    file = request.files["frame"]
    img_bytes = file.read()

    print("BYTES LEN:", len(img_bytes))

    if len(img_bytes) == 0:
        return jsonify({"error": "Empty frame"}), 400

    np_img = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if frame is None:
        return jsonify({"error": "Failed to decode image"}), 400

    try:
        result = analyze_frame(frame)
        return jsonify(result)
    except Exception as e:
        print("ANALYZE ERROR:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7001))
    app.run(host="0.0.0.0", port=port)
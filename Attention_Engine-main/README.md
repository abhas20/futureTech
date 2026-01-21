# Attention Engine

A lightweight local computer vision API that estimates user attentiveness from a single image frame.

**Detects:**

* face presence
* head orientation
* gaze direction

All processing is local, stateless, and privacy-safe.

---

## 🛠 Tech Stack

**Python · Flask · MediaPipe · OpenCV · NumPy**

---

## 📦 Setup

```bash
git clone https://github.com/AbhinavNeema/Attention_Engine.git
cd Attention_Engine

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

---

## ▶️ Run

```bash
python app.py
```

Server runs on:

```
http://127.0.0.1:7001
```

---

## 📡 API

**POST** `/analyze`

**Form-data:**

* `frame` → image file (jpg/png)

**Example (curl):**

```bash
curl -X POST http://127.0.0.1:7001/analyze -F "frame=@image.png"
```

**Response (JSON):**

```json
{
  "face_conf": 0.92,
  "head_conf": 0.86,
  "gaze_conf": 0.79
}
```

---

## 🔒 Privacy

* no video stored
* no tracking
* offline capable

---

## 👨‍💻 Author

**Abhinav Neema**
[https://github.com/AbhinavNeema](https://github.com/AbhinavNeema)

---

*If you want this exported as a `README.md` file or converted to HTML, tell me and I’ll add it.*

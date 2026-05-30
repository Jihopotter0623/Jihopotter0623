# Firebase Storage CORS Configuration

This guide explains how to configure Cross-Origin Resource Sharing (CORS) for your Firebase Storage bucket. This ensures that browsers can securely fetch or upload image files from your local development servers and production domains without raising CORS network interruptions.

## 1. Create a `cors.json` file

Create a file named `cors.json` (you can place this anywhere on your local computer, or use this file in projects) with the following content:

```json
[
  {
    "origin": [
      "http://localhost:3000",
      "https://true-weaver-ctn3v.firebaseapp.com",
      "https://true-weaver-ctn3v.web.app",
      "https://*.run.app"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "X-Requested-With", "ETag", "Metadata"],
    "maxAgeSeconds": 3600
  }
]
```

> **Note:** If you want to support easy debugging and general domain accessibility initially, you can set `"origin": ["*"]`, though restricting it to specified dev and production origins is recommended for hardened deployments.

---

## 2. Deploy the CORS Configuration

You can apply this file to your Firebase Storage bucket by using either the modern Google Cloud SDK (`gcloud`) or the legacy `gsutil` CLI.

Before starting, find your storage bucket domain (e.g., `true-weaver-ctn3v.firebasestorage.app`). You can find this in your **Firebase Console under Storage**, or inside your `firebase-applet-config.json` file.

### Option A: Using `gcloud` (Recommended modern command)

Open your terminal in the directory where `cors.json` is located, and run:

```bash
gcloud storage buckets update gs://true-weaver-ctn3v.firebasestorage.app --cors-file=cors.json
```

### Option B: Using `gsutil` (Classic command)

If you are using the classic `gsutil` tool, run the following:

```bash
gsutil cors set cors.json gs://true-weaver-ctn3v.firebasestorage.app
```

---

## 3. Verify Connection

Once successfully deployed, browser-side uploads of portfolio icons and hero pictures will stream smoothly with live uploads and preview downloads!

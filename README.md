# Rea

A web application for connecting and sharing resources within local communities.

---

## 1.1 Project Description

Rea is a neighborhood-based web application that enables users to share skills and borrow physical items from nearby community members. Instead of buying and selling, the platform focuses on lending, requesting, and returning resources through structured, trust-based interactions.

By facilitating real-world exchanges (request → lend → return → feedback), Rea promotes accountability, reduces waste, saves money, and strengthens local community connections.

---

## 1.2 Target Audience

Rea is designed for residents in neighborhoods, apartment complexes, and community-managed spaces where close proximity makes sharing practical.

It is ideal for users who want to:

* Borrow tools instead of purchasing them
* Share skills or help others locally
* Save money and reduce waste
* Build trust within their community

It also serves HOAs and property managers looking to encourage engagement or manage shared resources.

Rea is less suited for rural areas where distance limits frequent interaction.

---

## Setup & Run Instructions

### 1. Activate Virtual Environment

```bash
cd WhatsUpNeighbor
source .venv/bin/activate
```

### 2. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Django Backend

```bash
cd whatsupneighbor/backend
python manage.py migrate
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000/`

---

### 4. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 5. Run Frontend

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173/`

---

## Notes

* Run backend and frontend in separate terminals
* Skip `npm install` if dependencies are already installed
* Use `python manage.py migrate` to set up or reset the database

---

## Inspiration

---

## What It Does

---

## How We Built It

---

## Future Improvements

* Add API documentation
* Include project structure overview
* Add screenshots or demo GIFs
* Expand feature set (admin tools, trust metrics, etc.)

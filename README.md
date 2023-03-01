# Piiquante

I built a secure API for this hot sauce review website using MongoDB, Express, Mongoose, and Multer. This was project 6 for the OpenClassrooms Web Developer path.

## To view the project

1. First, clone the frontend for the site

```bash
git clone git@github.com:OpenClassrooms-Student-Center/Web-Developer-P6.git frontend
```

2. Then clone the backend

```bash
git clone git@github.com:tssa017/piiquante_review_site.git backend
```

3. Add images folder

```bash
cd backend
mkdir images
```

4. Launch the backend server with the following commands:

```bash
nodemon server
```

5. Launch the frontend with the following commands:

```bash
cd ../frontend
npm install
npm start
```

6. Remove the instruction 'Validators.required' from line 62 in (frontend/src/app/sauce-form/sauce-form.component.ts)
   This ensures image files are **not** required to make a POST request

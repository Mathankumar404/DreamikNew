# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


```
# MURVEN DreamikAI - NodeReactJS Web Project

This repository contains the code for the MURVEN DreamikAI e-commerce platform, developed using Node.js and ReactJS.

## How to Use and Update the Code

Follow these steps to work with the code and push updates:

### 1. Clone the Repository
First, clone the repository to your local machine using the following command:

```bash
git clone https://github.com/MURVENSolutions/MURVEN-DreamikAI-dreamik.com-NodeReactjs-web-prodv3.git
```

### 2. Navigate to the Project Directory
Once the repository is cloned, navigate to the project folder:

```bash
cd MURVEN-DreamikAI-dreamik.com-NodeReactjs-web-prodv3
```

### 3. Checkout a Branch
Check out the branch you want to work on. You can choose from available branches like `mathan-hostinger` or `sundar-div`:

```bash
git checkout mathan-hostinger
```
or
```bash
git checkout sundar-div
```

### 4. Make Updates
Now, you can make changes to the code and add your updates. OR you can create another branch using ```bash  git checkout -b 'your branch name' ```

### 5. Stage and Commit Your Changes
After making the necessary updates, stage and commit the changes:

```bash
git add .
git commit -m "Made changes to the mathan-hostinger or (sundar-div) branch OR your branch name"
```

### 6. Push Changes to the Branch
Push your changes to the remote branch:

```bash
git push origin mathan-hostinger
```
or
```bash
git push origin sundar-div
```
or
```bash
git push origin your branch name
```

### 7. Update Main Branch
To update the `main` branch, run the following command to build the project:

```bash
npm run build
```

This will create the `/dist` folder in your project directory. Upload the contents of the `dist` folder to the main repository, including:

- `/public`
- `/src`
- `index.html`
- JSON files
- etc.

Now, you're ready to push to the `main` branch if necessary.

## Project Structure

- `/public`: Contains public assets like images, fonts, etc.
- `/src`: Contains all source code for the frontend.
- `index.html`: The main HTML file.
- `JSONs`: Configuration files.

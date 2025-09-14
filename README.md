# CogApp

# Install node using choco
choco install nodejs-lts  
npm install -g npm@11.4.2  
npm install -g yarn  


# Initialize node project
npm init -y


# Install electron, react, typescript project
npm install --save-dev electron  
npm install react react-dom  
npm install -D typescript @types/react @types/react-dom  
npm install -D ts-loader  
npm install -D webpack webpack-cli html-webpack-plugin webpack-dev-server


# Initialize typescript transpiler
npx tsc --init  
npm install --save-dev electron-builder


# Build executable from python script
npm run python:build


# Integrate and build Setup.exe
npx electron-builder


# Run debug mode
npm start


# After clone git repository
npm install  
npm run python:build





# To use svg files as React components.
npm install --save-dev @svgr/webpack

# install tailwind
npm i -D tailwindcss postcss autoprefixer postcss-loader
npx tailwindcss init -p


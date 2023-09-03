const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = 'src/assets/images/blog/uploads';
const outputDir = 'dist/blog/images/uploads/';

// Check if the output directory exists, and create it if necessary
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {recursive: true});
  console.log('Created directory:', outputDir);
}

function convertToJpg(inputPath, outputPath) {
  sharp(inputPath)
    .jpeg({quality: 50}) // Set the quality here (0-100)
    .toFile(outputPath, (err, info) => {
      if (err) {
        console.error('Error converting image:', err);
      } else {
        console.log('Image converted:', outputPath);
      }
    });
}

function processDirectory(dirPath, outputSubDir = '') {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const outputSubDirPath = path.join(outputDir, outputSubDir);
      const outputFilePath = path.join(
        outputSubDirPath,
        file.replace(/\.(jpg|png)$/, '.jpg')
      );

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        if (stats.isDirectory()) {
          const subDir = path.join(outputSubDir, file);
          const subDirPath = path.join(outputDir, subDir);
          processDirectory(filePath, subDir); // Recursively process sub-directory
          if (!fs.existsSync(subDirPath)) {
            fs.mkdirSync(subDirPath, {recursive: true});
            console.log('Created subdirectory:', subDirPath);
          }
        } else if (file.endsWith('.jpg') || file.endsWith('.png')) {
          convertToJpg(filePath, outputFilePath);
        }
      });
    });
  });
}

processDirectory(inputDir);

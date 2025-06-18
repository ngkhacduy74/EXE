const fs = require('fs');
const path = require('path');

// Function to recursively find all JS files
function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findJsFiles(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function fixApiUrls() {
  console.log('🔧 Fixing all API URLs in frontend files...\n');
  
  const frontendDir = path.join(__dirname, 'frontend', 'src');
  const jsFiles = findJsFiles(frontendDir);
  
  let totalFixed = 0;
  
  jsFiles.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Replace all environment variable patterns
      content = content.replace(/process\.env\.REACT_APP_API_URL/g, '"http://localhost:4000"');
      content = content.replace(/process\.env\.REACT_APP_BACKEND_API/g, '"http://localhost:4000"');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        const relativePath = path.relative(__dirname, filePath);
        console.log(`✅ Fixed: ${relativePath}`);
        totalFixed++;
      }
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  });
  
  console.log(`\n🎉 API URL fixing completed!`);
  console.log(`📊 Total files fixed: ${totalFixed}`);
  console.log('💡 All files now use http://localhost:4000 instead of environment variables');
}

fixApiUrls(); 
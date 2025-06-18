const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  'frontend/src/Pages/ProductView.js',
  'frontend/src/Admin/ProductDetail.js',
  'frontend/src/Admin/PostDetatil.js',
  'frontend/src/Admin/MultiProductViewer.js',
  'frontend/src/Admin/ManaPost.js',
  'frontend/src/Admin/ManaProduct.js'
];

function fixApiUrls() {
  console.log('🔧 Fixing API URLs in frontend files...\n');
  
  filesToFix.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Replace process.env.REACT_APP_API_URL with http://localhost:4000
        content = content.replace(/process\.env\.REACT_APP_API_URL/g, '"http://localhost:4000"');
        
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✅ Fixed: ${filePath}`);
        } else {
          console.log(`⏭️  No changes needed: ${filePath}`);
        }
      } else {
        console.log(`❌ File not found: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  });
  
  console.log('\n🎉 API URL fixing completed!');
  console.log('💡 All files now use http://localhost:4000 instead of process.env.REACT_APP_API_URL');
}

fixApiUrls(); 
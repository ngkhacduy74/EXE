const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB using the same config as backend
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(`${process.env.DB_URL}`);
    console.log("✅ Connected to database:", process.env.DB_URL);
    return connect;
  } catch (err) {
    console.log("❌ Failed to connect to database:", err.message);
    throw err;
  }
};

const userSchema = new mongoose.Schema({
  id: String,
  fullname: String,
  phone: String,
  email: { type: String, required: true },
  address: String,
  password: String,
  gender: String,
  role: { type: String, required: true },
  ava_img_url: String,
  is_active: String,
  license: Boolean,
}, { timestamps: true, versionKey: false });

const User = mongoose.model('User', userSchema);

async function checkAndUpdateUserRole() {
  try {
    await connectDB();
    
    console.log('🔍 Checking all users and their roles...\n');
    
    // Get all users
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    console.log(`📊 Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullname || 'N/A'} (${user.email})`);
      console.log(`   Role: ${user.role || 'Not set'}`);
      console.log(`   ID: ${user._id}`);
      console.log('---');
    });
    
    // Check if any admin exists
    const admins = users.filter(user => user.role === 'Admin');
    console.log(`\n👑 Admins found: ${admins.length}`);
    
    if (admins.length === 0) {
      console.log('\n⚠️  No admin users found! Creating admin from first user...');
      
      if (users.length > 0) {
        const firstUser = users[0];
        console.log(`\n🔄 Updating ${firstUser.email} to Admin role...`);
        
        await User.findByIdAndUpdate(firstUser._id, { role: 'Admin' });
        console.log('✅ First user updated to Admin role');
        
        // Verify the update
        const updatedUser = await User.findById(firstUser._id);
        console.log(`✅ Verified: ${updatedUser.email} now has role: ${updatedUser.role}`);
      }
    } else {
      console.log('\n✅ Admin users exist:');
      admins.forEach(admin => {
        console.log(`   - ${admin.fullname || 'N/A'} (${admin.email})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the function
checkAndUpdateUserRole(); 
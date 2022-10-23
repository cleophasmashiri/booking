import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const { Schema } = mongoose;


const userSchema = new Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      trim: true,
    },
    email: {
      type: String,
      required: "Email is reuired",
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: "Pasword is required",
      min: 6,
      max: 64,
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
  },
  { timestamps: true }
);

userSchema.pre('save', function(next) {
    let user = this;
    if (user.isModified('password')) {
        return bcrypt.hash(user.password, 12, function(err, hash) {
            if (err) {
                console.log('BCRYPT Error', err);
                return next(err);
            }
            user.password = hash;
            return next();
        });
    }
});

userSchema.methods.comparePassword = function(password, next) {
  bcrypt.compare(password, this.password, function(err, match) {
    if (err) {
      console.log('Sign-in error', err);
      return next(null, false);
    }
    return next(null, match);
  });
}

export default mongoose.model("User", userSchema);

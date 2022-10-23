import User from './../models/user';
import jsonwebtoken from 'jsonwebtoken';

export const showMessage = (req, res) => {
    res.status(200).send(req.params.message);
};

export const register = async (req, res) => {
    console.log('register...', req.body);
    const {name, email, password} = req.body;
    if (!name) return res.status(400).send('Name is required');
    if (!password || password.length < 6) return res.status(400).send('Password is required and must be of lenght of 6 or more characters');
    const userExist = await User.findOne({email}).exec();
    if (userExist) return res.status(400).send('Email taken already');
    const user = new User({name, email, password});
    try {
        await user.save();
        console.log('User created', user);
        return res.json({ok: true});
    } catch (error) {
        console.log('Register user error', err);
        return res.status(400).send('Error try again');
    }
};

export const login = async (req, res) => {
    const {email, password } = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) return res.status(400).send('Email not found');
        user.comparePassword(password, (err, match) => {
            if (err || !match) return res.status(400).send('Invalid email or password');
            const token = jsonwebtoken.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
            res.json({token, user: {
                _id: user._id,
                name: user.name,
                email: user.email, 
                createdOn: user.createdOn,
                createdAt: user.createdAt 
            }})
        });
    } catch (error) {
        console.log('Sign-in error', error);
        return res.status(400).send('Sign-in failed!');
    }

};

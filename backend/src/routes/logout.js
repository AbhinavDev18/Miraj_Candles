export const logout = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: true
        };
        return res.status(200).cookie('token', '', options).json({message: 'User logged out successfully'});
    }
    catch(error) {
        return res.status(500).json({error: error.message});
    }
}

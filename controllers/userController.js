const { User, Thought } = require('../models');

module.exports = {
    // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    console.log ("get users route");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');
        
      if (!user) {
        return res.status(404).json({ message: 'No user with this ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

//create a user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
      console.log ("create user route");
    } catch (err) {
      res.status(500).json(err);
    }
  },

// update user using id of the user in Params and 
//update with details in the body
  async updateUser(req, res) {
    try{
      const user = await User.findOneAndUpdate(
        {_id: req.params.userId},
        {$set: req.body},
        {runValidators: true, new:true}
      ); 

      if(!user) {
        return res.status(404).json({message: "No user with this ID"})
      }

      res.json(user);

    }catch (err){
        res.status(500).json(err);  
    }
  },
    // Delete a user and associated friends
    async deleteUser(req, res) {
      try {
        const deletedUserId = req.params.userId;
    
        // Find all users who have the deleted user in their friends list
        const usersToUpdate = await User.find({ friends: deletedUserId });
    
        // Update the friends arrays of the users who have the deleted user as a friend
        await User.updateMany(
          { friends: deletedUserId },
          { $pull: { friends: deletedUserId } }
        );
    
        // Delete the user
        const deletedUser = await User.findOneAndDelete({ _id: deletedUserId });
    
        if (!deletedUser) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
    
        res.json({ message: 'User and associated friends deleted!' });
      } catch (err) {
        res.status(500).json(err);
      }
    }
    ,

    //add a friend using PUT (update) to a user document
    async addFriend(req, res) {
        try {
          const {userId, friendId} = req.params;
          const user = await User.findOne( {_id: userId});
          const friend = await User.findOne( {_id: friendId});

          //check if user exists
          if (!user) {
            return res.status(404).json({ message: 'No user with this ID to add friend' });
          }
          //check if friend exists
          if (!friend) {
            return res.status(404).json({ message: 'No user with this ID to add as a friend' });
          }

          //add friend to the user
          user.friends.push(friendId);
          await user.save();

          res.json(user);    

        }catch(err) {
            res.status(500).json(err); 
        }

    },
        //Delete a friend 
        async deleteFriend(req, res) {
            try {
              const {userId, friendId} = req.params;
              const user = await User.findOne( {_id: userId});
              const friend = await User.findOne( {_id: friendId});
    
              //check if user exists
              if (!user) {
                return res.status(404).json({ message: 'No user with this ID to add friend' });
              }
              //check if friend exists
              if (!friend) {
                return res.status(404).json({ message: 'No user with this ID to add as a friend' });
              }
    
              //add friend to the user
              user.friends.pull(friendId);
              await user.save();
    
              res.json(user);    
    
            }catch(err) {
                res.status(500).json(err); 
            }
    
        },

};
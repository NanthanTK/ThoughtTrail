const { User, Thought, Reaction } = require('../models');

module.exports = {
    //get all Thoughts
    async getThoughts(req, res) {
        try{
            const thoughts= await Thought.find();
            res.json(thoughts);
        }catch(err){
            res.status(500).json(err);
        }
    },

    //get a single thought
    async getSingleThought(req, res) {
        try{
            const thought= await Thought.findOne({_id: req.params.thoughtId });

            if(!thought){
                return res.status(404).json({message: 'no thought with that ID'})
            }
            res.json(thought);
        }catch(err){
            res.status(500).json(err);
        }
    },

    //create a new thought
    async createThought (req, res) {
      try{
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
  
        if (!user) {
          return res
            .status(404)
            .json({ message: 'Thought created, but found no user with that ID' });
        }
  
        res.json('Created the thought');

      }catch(err){
        res.status(500).json(err)  
      }

    },

    //update a thought
    async updateThought (req, res) {
        try {
            const thought= await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
              }
        
              res.json(thought);

        }catch(err){
            res.status(500).json(err);
        }
    },

    //delete a thought
    async deleteThought (req, res) {
        try {
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

            if (!thought) {
              return res.status(404).json({ message: 'No thought with this id!' });
            }
      
            const user = await User.findOneAndUpdate(
              { _id: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            );      
    
            res.json({ message: 'Thought successfully deleted!' });

        }catch(err){
            res.status(500).json(err);
        }

    },
    //Add a reaction
    async addReaction (req, res) {
        try {
            const reaction = req.body;
            console.log (reaction)
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                { $push: {reactions: reaction}},
                {new: true}
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json('added reaction')

        }catch(err){
            res.status(500).json(err);
        }
    },

    //delete a reaction
    async deleteReaction(req, res) {
        try {
          const reactionId = req.body.reactionId;
          console.log(reactionId);
      
          const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { _id: reactionId } } },
            { new: true }
          );
      
          if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
          }
      
          res.json({ message: 'Reaction deleted successfully' });
        } catch (err) {
          res.status(500).json(err);
        }
      },

};
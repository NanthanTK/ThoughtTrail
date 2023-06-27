const mongoose = require('mongoose');

//reaction subdocument
const reactionSchema = new mongoose.Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
      },
    reactionBody : {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
    {
        toJSON: {
          virtuals: true,
        },
        id: false,
      }
);

//virtual to format timestamp
reactionSchema.virtual('raectionCreatedAt').get(function()
    {
        return this.createdAt.toISOString();
    });

const thoughtSchema = new Schema({
    thoughtText : {
        type: String,
        required: true,
        minLength:1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    username:{
        type: String,
        required: true,
    },
    reactions:[reactionSchema],
},
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

thoughtSchema.virtual('thoughtCreatedAt').get(function()
    {
        return this.createdAt.toISOString();
    });

thoughtSchema.virtual('thoughtCount').get(function()
    {
        return this.reactions.length;
    });
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
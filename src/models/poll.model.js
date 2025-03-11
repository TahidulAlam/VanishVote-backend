import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    options: [{ type: String, required: true }],
    votes: [
      {
        option: { type: String, required: true },
        count: { type: Number, default: 0 },
      },
    ],
    reactions: {
      trending: { type: Number, default: 0 },
      like: { type: Number, default: 0 },
    },
    endTime: { type: Date, required: true },
    hideResults: { type: Boolean, default: false },
  },
  { timestamps: true }
);

pollSchema.methods.getSafePollData = function () {
  const now = new Date();
  const pollEnded = now >= this.endTime;

  return {
    title: this.title,
    options: this.options,
    endTime: this.endTime,
    reactions: this.reactions,
    hideResults: this.hideResults,
    votes: this.hideResults && !pollEnded ? [] : this.votes,
  };
};

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;

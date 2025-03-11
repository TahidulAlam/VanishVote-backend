import Poll from "../models/poll.model.js";

export const createPoll = async (req, res) => {
  try {
    const { title, description, options, duration, hideResults } = req.body;

    if (!title || !options || !duration) {
      return res
        .status(400)
        .json({ message: "Title, options, and duration are required." });
    }

    const validDurations = [1, 12, 24];
    const durationNum = Number(duration);

    if (!validDurations.includes(durationNum)) {
      return res.status(400).json({
        message: "Invalid duration value. Choose 1, 12, or 24 hours.",
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res
        .status(400)
        .json({ message: "At least two options are required." });
    }

    const durationMs = durationNum * 60 * 60 * 1000;
    const endTime = new Date(Date.now() + durationMs);

    const cleanedOptions = [
      ...new Set(options.map((opt) => opt.trim())),
    ].filter((opt) => opt);

    if (cleanedOptions.length < 2) {
      return res
        .status(400)
        .json({ message: "Poll must have at least two unique options." });
    }

    const newPoll = new Poll({
      title: title.trim(),
      description: description?.trim() || "",
      options: cleanedOptions,
      votes: cleanedOptions.map((opt) => ({ option: opt, count: 0 })),
      reactions: { trending: 0, like: 0 },
      endTime,
      hideResults: Boolean(hideResults),
    });

    await newPoll.save();

    res.status(201).json({
      message: "Poll created successfully",
      poll: newPoll,
      _id: newPoll._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating poll", error: error.message });
  }
};

export const getSinglePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.status(200).json(poll);
  } catch (error) {
    console.error("Error fetching poll:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const votePoll = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Poll ID is required" });
    }

    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Process votes
    const { selectedOptions } = req.body;
    if (!selectedOptions || selectedOptions.length === 0) {
      return res.status(400).json({ message: "No options selected" });
    }

    selectedOptions.forEach((option) => {
      const existingOption = poll.votes.find((v) => v.option === option);
      if (existingOption) {
        existingOption.count += 1;
      } else {
        poll.votes.push({ option, count: 1 });
      }
    });

    await poll.save();
    res.json({ message: "Vote submitted successfully", votes: poll.votes });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error submitting vote", error: error.message });
  }
};

export const reactPoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { reaction } = req.body;

    // Validate Poll ID
    if (!id) {
      return res.status(400).json({ message: "Poll ID is required" });
    }

    // Validate Reaction Type
    const validReactions = ["trending", "like"];
    if (!validReactions.includes(reaction)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    // Find Poll
    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Toggle reaction logic
    if (poll.reactions[reaction] > 0) {
      poll.reactions[reaction] -= 1;
    } else {
      poll.reactions[reaction] += 1;
    }

    await poll.save();

    res.json({
      message: "Reaction updated successfully",
      reactions: poll.reactions,
    });
  } catch (error) {
    console.error("Error updating reaction:", error);
    res.status(500).json({
      message: "Error updating reaction",
      error: error.message,
    });
  }
};

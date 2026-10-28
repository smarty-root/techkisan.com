const express = require('express');
const router = express.Router();
const groupChatModel = require('../models/group-chat-model');
const messageModel = require('../models/message-model');
const groupMessageModel = require('../models/groups-messges');

// Create a new group
router.post('/create', async (req, res) => {
  try {
    const { groupName, members, groupAdmin } = req.body;
    const newGroup = new groupChatModel({
      groupName,
      members,
      groupAdmin
    });
    const savedGroup = await newGroup.save();
    res.status(200).json(savedGroup);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Error creating group' });
  }
});

// Get user's groups
router.get('/user/:userId', async (req, res) => {
  try {
    const groups = await groupChatModel.find({
      members: { $in: [req.params.userId] }
    });
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

// Get group messages
router.get('/messages/:groupId', async (req, res) => {
  try {
  
    const {groupId} = req.params;
    const messages = await groupMessageModel.find({groupId}).populate('sender')
    console.log(messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching group messages:', error);
    res.status(500).json({ message: 'Error fetching group messages' });
  }
});

// Add member to group
router.post('/:groupId/members', async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await groupChatModel.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'User already in group' });
    }

    group.members.push(userId);
    await group.save();
    
    res.status(200).json(group);
  } catch (error) {
    console.error('Error adding member to group:', error);
    res.status(500).json({ message: 'Error adding member to group' });
  }
});

// Remove member from group
router.delete('/:groupId/members/:userId', async (req, res) => {
  try {
    const group = await groupChatModel.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(req.params.userId)) {
      return res.status(400).json({ message: 'User not in group' });
    }

    group.members = group.members.filter(
      memberId => memberId.toString() !== req.params.userId
    );
    await group.save();
    
    res.status(200).json(group);
  } catch (error) {
    console.error('Error removing member from group:', error);
    res.status(500).json({ message: 'Error removing member from group' });
  }
});

module.exports = router;
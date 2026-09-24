import SponsoredPost from '../models/SponsoredPost.js';
import User from '../models/User.js';

// @desc    Get all active sponsored posts
// @route   GET /api/sponsored-posts
// @access  Public
export const getSponsoredPosts = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const sponsoredPosts = await SponsoredPost.find({
      endDate: { $gte: currentDate } // ✅ Removed isActive filter
    })
    .populate('createdBy', 'name email')
    .sort({ priority: -1, createdAt: -1 });

    res.json({
      success: true,
      count: sponsoredPosts.length,
      data: sponsoredPosts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all sponsored posts (admin only)
// @route   GET /api/sponsored-posts/admin/all
// @access  Private/Admin
export const getAllSponsoredPosts = async (req, res) => {
  try {
    const sponsoredPosts = await SponsoredPost.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sponsoredPosts.length,
      data: sponsoredPosts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create sponsored post
// @route   POST /api/sponsored-posts
// @access  Private/Admin
export const createSponsoredPost = async (req, res) => {
  try {
    const { title, content, endDate, priority } = req.body; // ✅ Removed link

    const sponsoredPost = new SponsoredPost({
      title,
      content,
      // ✅ Removed link
      endDate,
      priority: priority || 1,
      createdBy: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    const createdPost = await sponsoredPost.save();
    await createdPost.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Sponsored post created successfully',
      data: createdPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update sponsored post
// @route   PUT /api/sponsored-posts/:id
// @access  Private/Admin
export const updateSponsoredPost = async (req, res) => {
  try {
    const { title, content, endDate, priority } = req.body; // ✅ Removed link and isActive

    const sponsoredPost = await SponsoredPost.findById(req.params.id);

    if (!sponsoredPost) {
      return res.status(404).json({ message: 'Sponsored post not found' });
    }

    sponsoredPost.title = title || sponsoredPost.title;
    sponsoredPost.content = content || sponsoredPost.content;
    // ✅ Removed link update
    sponsoredPost.endDate = endDate || sponsoredPost.endDate;
    // ✅ Removed isActive update
    sponsoredPost.priority = priority || sponsoredPost.priority;

    if (req.file) {
      sponsoredPost.image = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await sponsoredPost.save();
    await updatedPost.populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Sponsored post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete sponsored post
// @route   DELETE /api/sponsored-posts/:id
// @access  Private/Admin
export const deleteSponsoredPost = async (req, res) => {
  try {
    const sponsoredPost = await SponsoredPost.findById(req.params.id);

    if (!sponsoredPost) {
      return res.status(404).json({ message: 'Sponsored post not found' });
    }

    await SponsoredPost.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Sponsored post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single sponsored post
// @route   GET /api/sponsored-posts/:id
// @access  Public
export const getSponsoredPost = async (req, res) => {
  try {
    const sponsoredPost = await SponsoredPost.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!sponsoredPost) {
      return res.status(404).json({ message: 'Sponsored post not found' });
    }

    res.json({
      success: true,
      data: sponsoredPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
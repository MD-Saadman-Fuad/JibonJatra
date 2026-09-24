


import Post from '../models/Post.js';
import Market from '../models/Market.js';
import Product from '../models/Product.js';
import Item from '../models/Item.js';
import Service from '../models/Service.js';
import Announcement from '../models/Announcement.js';

export const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch all content types in parallel
    const [
      posts,
      marketItems,
      products,
      lostFoundItems,
      services
    ] = await Promise.all([
      // Posts - uses 'user' field
      Post.find()
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      
      // Market items - uses 'createdBy' field
      Market.find()
        .populate('createdBy', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      
      // Products - uses 'owner' field
      Product.find()
        .populate('owner', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      
      // Lost & Found items - uses 'user' field
      Item.find()
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      
      // Services - uses 'createdBy' field
      Service.find()
        .populate('createdBy', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    // ADD THIS SECTION - Combine and sort all content by creation date
    const allContent = [
      ...posts.map(item => ({ ...item, contentType: 'posts' })),
      ...marketItems.map(item => ({ ...item, contentType: 'market' })),
      ...products.map(item => ({ ...item, contentType: 'products' })), // Changed to 'products'
      ...lostFoundItems.map(item => ({ ...item, contentType: 'lost-found' })),
      ...services.map(item => ({ ...item, contentType: 'services' }))  // Changed to 'services'
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get announcements for sidebar
    const announcements = await Announcement.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      feed: allContent.slice(0, limit),
      announcements,
      pagination: {
        current: page,
        hasNext: allContent.length > limit,
        total: allContent.length
      }
    });
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feed'
    });
  }
};

export const getFilteredFeed = async (req, res) => {
  try {
    const { type } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let content;
    let total;

    switch (type) {
      case 'posts':
        content = await Post.find()
          .populate('user', 'name email role')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
        total = await Post.countDocuments();
        break;

      case 'market':
        content = await Market.find()
          .populate('createdBy', 'name email role')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
        total = await Market.countDocuments();
        break;

      case 'products':
        content = await Product.find()
          .populate('owner', 'name email role')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
        total = await Product.countDocuments();
        break;

      case 'lost-found':
        content = await Item.find()
          .populate('user', 'name email role')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
        total = await Item.countDocuments();
        break;

      case 'services':
        content = await Service.find()
          .populate('createdBy', 'name email role')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
        total = await Service.countDocuments();
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid content type'
        });
    }

    // Get announcements for sidebar
    const announcements = await Announcement.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      feed: content.map(item => ({ ...item, contentType: type })),
      announcements,
      pagination: {
        current: page,
        hasNext: skip + content.length < total,
        total
      }
    });
  } catch (error) {
    console.error('Filtered feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filtered feed'
    });
  }
};
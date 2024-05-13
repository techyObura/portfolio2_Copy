import Project from "../models/project.model.js";

export const createProject = async (req, res, next) => {
  const { description, url, title, image, isComplete } = req.body;

  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You do not have permission"));
  }

  console.log(description, url, isComplete, title, image);
  try {
    const newProject = await Project.create({
      description,
      url,
      title,
      image,
      isComplete,
      userId: req.user.id,
    });

    res.status(200).json(newProject);
  } catch (error) {
    next(error.message);
  }
};
export const getProjects = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex || 0);
    const limit = parseInt(req.query.limit);

    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const projects = await Project.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.projectId && { _id: req.query.projectId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalProjects = await Project.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthProjects = await Project.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ projects, totalProjects, lastMonthProjects });
  } catch (error) {
    next(error.message);
  }
};
export const editProject = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next("You are not allowed!");
    }

    const editedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        userId: req.user.id,
        ...req.body,
      },
      { new: true }
    );

    res.status(200).json(editedProject);
  } catch (error) {
    next(error.message);
  }
};
export const deleteProject = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next("You are not allowed!");
    }
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json("Deleted");
  } catch (error) {
    next(error.message);
  }
};

const validateVideoUpload = (req) => {
  const { userId, title, category } = req.body;
  const errors = [];

  if (!userId) errors.push("userId is required");
  if (!title) errors.push("title is required");
  if (!category) errors.push("category is required");
  
  const validCategories = [
    "deforestation",
    "pollution",
    "land-grabbing",
    "challenge",
    "education",
  ];
  
  if (category && !validCategories.includes(category)) {
    errors.push(`category must be one of: ${validCategories.join(", ")}`);
  }

  if (title && title.length < 3) {
    errors.push("title must be at least 3 characters");
  }

  if (title && title.length > 100) {
    errors.push("title must be less than 100 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateChallenge = (req) => {
  const { name, description, category } = req.body;
  const errors = [];

  if (!name) errors.push("name is required");
  if (!description) errors.push("description is required");
  if (!category) errors.push("category is required");

  if (name && name.length < 3) {
    errors.push("name must be at least 3 characters");
  }

  if (description && description.length < 10) {
    errors.push("description must be at least 10 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateTemplate = (req) => {
  const { name, category } = req.body;
  const errors = [];

  if (!name) errors.push("name is required");
  if (!category) errors.push("category is required");

  if (name && name.length < 3) {
    errors.push("name must be at least 3 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateImpact = (req) => {
  const { userId, type, count } = req.body;
  const errors = [];

  if (!userId) errors.push("userId is required");
  if (!type) errors.push("type is required");

  const validTypes = [
    "tree_planted",
    "cleanup_attended",
    "petition_signed",
    "video_created",
    "challenge_joined",
    "video_shared",
  ];

  if (type && !validTypes.includes(type)) {
    errors.push(`type must be one of: ${validTypes.join(", ")}`);
  }

  if (count && count < 1) {
    errors.push("count must be at least 1");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateVideoUpload,
  validateChallenge,
  validateTemplate,
  validateImpact,
};
const { userService} = require("../services");
const { User } = require("../models");// use in delete many 

/* ------------------------ GET USER LIST (ROLE WISE) WITH AUTH ----------------------- */
const getUserListRole = async (req, res) => {
  try {
    const getList = await userService.getUserListSimple(req, res);
    const userRole=req.body.role;
    let users=[];
    if(userRole==='user'){
     for(let i=0 ;i<getList.length;i++){
      if(getList[i].role!=="admin"){
        users.push(getList[i]);
        }
        }
        console.log("users",users);
        res.send(users);
        }else{
          res.send(getList);
          }
          } catch (err) {
            console.log('Error in getting the user list', err);
            res.status(500).send(err);
            }
            };


/* -------------- GET USER LIST WITH SIMPLE AUTH AND PAGINATION ------------- */
const getUserList = async (req, res) => {
  try {
    const { search, page, perPage, ...options } = req.query;
    let filter = {};

    if (search) {
      filter.user_name = { $regex: search, $options: "i" };
    }

    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 3;

    // Calculate the number of documents to skip based on the current page and items per page
    const skip = (currentPage - 1) * itemsPerPage;

    const userList = await userService.getUserList(filter, {
      skip: skip,
      limit: itemsPerPage,
      ...options, // You can pass other query options here
    });

    res.status(200).json({
      success: true,
      message: "Get user list successfully!",
      data: userList,
      currentPage: currentPage,
      totalPages: Math.ceil(userList.length / itemsPerPage),
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


/* --------------- GET USER LIST ROLE WISE (SIMPLE) WITH AUTH --------------- */
const getAllUser = async (req, res) => {
  try {
    const data = await userService.getAllUser({ role: req.body.role });
    res.status(200).json({
      success: true,
      message: "User list successfully!",
      data: { data },
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* --------------------------- GET USER LIST BY ID -------------------------- */
const getUserDetails = async (req, res) => {
  try {
    const getDetails = await userService.getUserById(req.params.userId);
    if (!getDetails) {
      throw new Error("User not found!");
    }

    res.status(200).json({
      success: true,
      message: "User details get successfully!",
      data: getDetails,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* -------------------------- GET USER UPDATE BY ID ------------------------- */
const updateDetails = async (req, res) => {
  try {
    // const reqBody=req.body;
    const userId = req.params.userId;
    const { role, gender,user_name,address } = req.body; // Extract the 'role' and 'gender' fields from the request body
    const userExists = await userService.getUserById(userId);

    if (!userExists) {
      throw new Error("User not found!");
    }

    if (userExists.role === 'admin' && role !== 'admin') {
      throw new Error("Admins cannot change their role");
    }

    if (userExists.role !== 'admin' && role === 'admin') {
      throw new Error("You are not allowed to change your role to admin");
    }

    // Update the user's gender and other details
    userExists.gender = gender; // Update the 'gender' field
    userExists.user_name = user_name; // Update the 'firstName' field
    userExists.address = address; // Update the 'lastName' field
    if (req.file) {
      userExists.profile_img = req.file.filename; // Store the path to the uploaded profile image
    }
    await userService.updateUser(userId, userExists); // Save the updated user

    res.status(200).json({
      success: true,
      message: "User details updated successfully!",
      data: userExists,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};




/* ------------------------ DELETE SINGLE USER BY ID ------------------------ */
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userExists = await userService.getUserById(userId);
    if (!userExists) {
      throw new Error("User not found!");
    }

    await userService.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: "User delete successfully!",
      data:userExists,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ------------------------- DELETE MANY USER BY ID ------------------------- */
const deleteManyUsers = async (req, res) => {
  try {
    const {_id} = req.body;
const result=await User.deleteMany({_id:{$in:  _id}});
if(result.deletedCount===0){
  throw new Error('No users deleted');
}
    return res.status(200).send({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: `${err}`,
    });
  }
};

module.exports = {
   getAllUser,
  getUserListRole,
  getUserList,
  getUserDetails,
  updateDetails,
  deleteUser,
  deleteManyUsers,
};

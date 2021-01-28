const Joi = require('@hapi/joi');


//Register Validation
const registerValidation = data => {
    const schema = Joi.object({
       // name: Joi.string().min(6),
        email: Joi.string().required().min(6).email(),
        first_name: Joi.string().required(),
        last_name:  Joi.string().required(),
        biography:  Joi.string(),
        phoneNumber: Joi.string(),
        city: Joi.string(),
        avatar: Joi.string(),
        
      //  password: Joi.string().min(6).required()
    });
    
    return schema.validate(data);
};
//Login Validation
const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().required().min(6).email(),
        password: Joi.string().min(6).required()
    });
    
    return schema.validate(data);
};
const titlesValidation = data => {
    const schema = Joi.object({
        title: Joi.string().required().min(6),
        description: Joi.string().min(6).required(),
        post_user_id: Joi.required(),
        username: Joi.required(),
    });
    
    return schema.validate(data);
};

const commentValidation = data => {
    const schema = Joi.object({
        comment: Joi.string().required().min(1),
        post_user_id: Joi.required(),
        titles_id: Joi.required()
    });
    
    return schema.validate(data);
};

const videoCommentValidation = data => {
    const schema = Joi.object({
        titles_id: Joi.string().required().min(1),
        post_user_id: Joi.required()
    });
    
    return schema.validate(data);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.titlesValidation = titlesValidation;
module.exports.commentValidation = commentValidation;
module.exports.videoCommentValidation = videoCommentValidation;
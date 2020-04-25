const graphql = require('graphql')
var _ = require('lodash')
const User = require('../model/User');
const Hobby = require('../model/Hobby');
const Post = require('../model/Post');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull

} = graphql

//create types
const UserType = new GraphQLObjectType({
    name:  'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({userId: parent.id})
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({userId: parent.id})
            }
        }
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hoppy',
    description: 'Hobby for user...',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        userId: {type: GraphQLID},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId)
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post for user...',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        userId: {type: GraphQLID},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId)
            }
        }
    })
})

//root query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    description: "Description",
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return User.findById(args.id)
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({})
            }
        },
        hoppy: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Hobby.findById(args.id)
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({})
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Post.findById(args.id)
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({})
            }
        }
    }
});

//Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                //id: {type: GraphQLID}
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                })
                return user.save()
            }
        },

        updateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                return updateUpdate = User.findByIdAndUpdate(
                    args.id, 
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession
                        }
                    },
                    {
                        new: true
                    }
                )
            }
        },

        deleteUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                return deleteUser = User.findByIdAndRemove(args.id).exec()
            }
        },
        
        createPost: {
            type: PostType,
            args: {
                id: {type: GraphQLID},
                comment: {type: GraphQLString},
                userId: {type: GraphQLID},
            },
            resolve(parent, args) {
                let post = new Post({
                    id: args.id,
                    comment: args.comment,
                    userId: args.userId
                })
                return post.save()
            }
        },

        updatePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                comment: {type: GraphQLString}
            },
            resolve(parent, args) {
                return updatePost = Post.findByIdAndUpdate(
                    args.id, 
                    {
                        $set: {
                            comment: args.comment
                        }
                    },
                    {
                        new: true
                    }
                )
            }
        },


        deletePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                return deletePost = Post.findByIdAndRemove(args.id).exec()
            }
        },

        createHobby: {
            type: HobbyType,
            args: {
                id: {type: GraphQLID},
                title: {type: GraphQLString},
                description: {type: GraphQLString},
                userId: {type: GraphQLID}
            },
            resolve(parent, args) {
                let hobby = new Hobby ({
                    id: args.id,
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                })
                return hobby.save()
            }
        },
        updateHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                title: {type: GraphQLString},
                description: {type: GraphQLString}
            },
            resolve(parent, args) {
                return updateHobby = Hobby.findByIdAndUpdate(
                    args.id, 
                    {
                        $set: {
                            title: args.title,
                            description: args.description,
                        }
                    },
                    {
                        new: true
                    }
                )
            }
        },

        deleteHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                return deleteHobby = Hobby.findByIdAndRemove(args.id).exec()
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
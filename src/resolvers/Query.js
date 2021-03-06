import getUserId from '../utils/getUserId';


const Query = {
  async me(parent, args, {prisma , request} , info) {
    const userId = getUserId(request);
    const user  = await prisma.query.user({
      where: {
        id: userId
      }
    });
    return user;
  },

  async post(parent, args, {prisma, request}, info) {
    const userId = getUserId(request, false);

    const posts = await prisma.query.posts({
      where: {
        id: args.id,
        OR: [
          {
            published: true
          },
          {
            author: {
              id: userId
            }
          }

        ]
      }
    }, info);

    if(posts.length === 0) {
      throw new Error(`Post not found`);
    }

    return posts[0];
  },

  myPosts(parent , args , {prisma, request} , info) {
    const userId = getUserId(request);
    const {first, skip, after, orderBy} = args;

    const opArgs = {
      where: {
        author: {
          id: userId
        },
      },
      first, 
      skip,
      after,
      orderBy
    };
    if(args.query){
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }
    return prisma.query.posts(opArgs, info);
  },

  posts(parent , args , {prisma} , info) {
    const {first , skip , after, orderBy} = args;
    const opArgs = {
      where: {
        published: true
      },
      first,
      skip,
      after,
      orderBy
    };
    if(args.query){
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }
    return prisma.query.posts(opArgs, info);
  },

  users(parent , args , {prisma} , info) {
    const {first , skip, after, orderBy} = args;
    const opArgs = {
      first,
      skip,
      after,
      orderBy
    };
    
    if(args.query){
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          }
        ]
      }
    }

    return prisma.query.users(opArgs, info);
  },

  comments(parent , args , {prisma} , info) {
    const {query, first, after, skip, orderBy} = args;
    const opArgs = {
      first,
      after,
      skip,
      orderBy
    };
    if (query) {
      opArgs.where = {
        text_contains: query
      }
    }
    return prisma.query.comments(opArgs, info);
  }
};

export {Query as default};
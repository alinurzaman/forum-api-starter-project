const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DeletedComment = require('../../../Domains/comments/entities/DeletedComment');
const RawComment = require('../../../Domains/comments/entities/RawComment');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const postThread = new PostThread({
        title: 'thread title',
        body: 'thread body',
      });
      const addComment = new AddComment({
        content: 'new comment',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);
      const postedThread = await threadRepositoryPostgres.addThread(postThread, registeredUser.id);
      await commentRepositoryPostgres.addComment(addComment, postedThread.id, registeredUser.id);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const postThread = new PostThread({
        title: 'thread title',
        body: 'thread body',
      });
      const addComment = new AddComment({
        content: 'new comment',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);
      const postedThread = await threadRepositoryPostgres.addThread(postThread, registeredUser.id);
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment,
        postedThread.id,
        registeredUser.id,
      );

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'new comment',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyExistedComment function', () => {
    it('should throw NotFoundError when comment is not exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'new title' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyExistedComment('comment-123456')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'new title' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyExistedComment('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when comment is not belong to user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'new title' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123456'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment is belong to user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'new title' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should persist delete comment and return deleted comment correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const postThread = new PostThread({
        title: 'thread title',
        body: 'thread body',
      });
      const addComment = new AddComment({
        content: 'new comment',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);
      const postedThread = await threadRepositoryPostgres.addThread(postThread, registeredUser.id);
      await commentRepositoryPostgres.addComment(
        addComment,
        postedThread.id,
        registeredUser.id,
      );
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments[0].is_deleted).toBeTruthy();
    });
    it('should return deleted comment correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const postThread = new PostThread({
        title: 'thread title',
        body: 'thread body',
      });
      const addComment = new AddComment({
        content: 'new comment',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);
      const postedThread = await threadRepositoryPostgres.addThread(postThread, registeredUser.id);
      await commentRepositoryPostgres.addComment(
        addComment,
        postedThread.id,
        registeredUser.id,
      );
      const deletedComment = await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      expect(deletedComment).toStrictEqual(new DeletedComment({
        id: 'comment-123',
        isDeleted: true,
      }));

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments[0].is_deleted).toStrictEqual(true);
    });
  });
  describe('getThreadComments function', () => {
    it('should return thread comments correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const postThread = new PostThread({
        title: 'thread title',
        body: 'thread body',
      });
      const addComment = new AddComment({
        content: 'new comment',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);
      const postedThread = await threadRepositoryPostgres.addThread(postThread, registeredUser.id);
      await commentRepositoryPostgres.addComment(
        addComment,
        postedThread.id,
        registeredUser.id,
      );
      const comments = await CommentsTableTestHelper.findCommentsByThreadId('thread-123');
      const threadComments = await commentRepositoryPostgres.getThreadComments(postedThread.id);

      // Assert
      expect(threadComments[0]).toStrictEqual(new RawComment({
        id: 'comment-123',
        username: 'dicoding',
        date: comments[0].date,
        content: 'new comment',
        isDeleted: false,
      }));
    });
  });
});

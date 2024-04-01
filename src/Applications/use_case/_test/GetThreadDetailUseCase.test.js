const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadComment = require('../../../Domains/comments/entities/ThreadComment');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const useCaseId = 'thread-123';

    const mockThreadDetail = new ThreadDetail({
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: '2024-03-28T14:48:00.000Z',
      username: 'dicoding',
    });

    const mockThreadComment = new ThreadComment({
      id: 'comment-123',
      username: 'dicoding',
      date: '2024-03-28T14:48:00.000Z',
      content: 'new comment',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetail = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetail));
    mockCommentRepository.getThreadComments = jest.fn()
      .mockImplementation(() => Promise.resolve([mockThreadComment]));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCaseId);
    const threadComment = threadDetail.comments[0];
    delete threadDetail.comments;

    // Assert
    expect(threadDetail).toStrictEqual(new ThreadDetail({
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: '2024-03-28T14:48:00.000Z',
      username: 'dicoding',
    }));
    expect(threadComment).toStrictEqual(new ThreadComment({
      id: 'comment-123',
      username: 'dicoding',
      date: '2024-03-28T14:48:00.000Z',
      content: 'new comment',
    }));

    expect(mockThreadRepository.getThreadDetail)
      .toBeCalledWith(useCaseId);
    expect(mockCommentRepository.getThreadComments)
      .toBeCalledWith(useCaseId);
  });
});

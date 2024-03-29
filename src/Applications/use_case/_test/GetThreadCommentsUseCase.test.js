const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadCommentsUseCase = require('../GetThreadCommentsUseCase');
const ThreadComment = require('../../../Domains/comments/entities/ThreadComment');

describe('GetThreadCommentUseCase', () => {
  it('should orchestrating the get thread comment action correctly', async () => {
    // Arrange
    const useCaseId = 'comment-123';

    const mockThreadComment = new ThreadComment({
      id: 'comment-123',
      username: 'dicoding',
      date: '2024-03-28T14:48:00.000Z',
      content: 'new comment',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.getThreadComments = jest.fn()
      .mockImplementation(() => Promise.resolve([mockThreadComment]));

    /** creating use case instance */
    const getThreadCommentUseCase = new GetThreadCommentsUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadComments = await getThreadCommentUseCase.execute(useCaseId);
    const threadComment = threadComments[0];

    // Assert
    expect(threadComment).toStrictEqual(new ThreadComment({
      id: 'comment-123',
      username: 'dicoding',
      date: '2024-03-28T14:48:00.000Z',
      content: 'new comment',
    }));

    expect(mockCommentRepository.getThreadComments)
      .toBeCalledWith(useCaseId);
  });
});

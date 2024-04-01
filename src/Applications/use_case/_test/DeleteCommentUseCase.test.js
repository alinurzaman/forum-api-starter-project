const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const DeletedComment = require('../../../Domains/comments/entities/DeletedComment');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      isDeleted: true,
    };
    const useCaseId = 'comment-123';
    const useCaseThreadId = 'thread-123';
    const useCaseOwner = 'user-123';

    const mockDeletedComment = new DeletedComment({
      id: 'comment-123',
      isDeleted: useCasePayload.isDeleted,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyExistedThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyExistedComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDeletedComment));

    /** creating use case instance */
    const getDeleteUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const deletedComment = await getDeleteUseCase.execute(useCaseId, useCaseThreadId, useCaseOwner);

    // Assert
    expect(deletedComment).toStrictEqual(new DeletedComment({
      id: 'comment-123',
      isDeleted: useCasePayload.isDeleted,
    }));

    expect(mockThreadRepository.verifyExistedThread).toBeCalledWith(useCaseThreadId);
    expect(mockCommentRepository.verifyExistedComment).toBeCalledWith(useCaseId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCaseId, useCaseOwner);
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(useCaseId);
  });
});

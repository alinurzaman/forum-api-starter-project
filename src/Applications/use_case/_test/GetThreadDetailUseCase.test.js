const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

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

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetail = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetail));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCaseId);

    // Assert
    expect(threadDetail).toStrictEqual(new ThreadDetail({
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: '2024-03-28T14:48:00.000Z',
      username: 'dicoding',
    }));

    expect(mockThreadRepository.getThreadDetail)
      .toBeCalledWith(useCaseId);
  });
});

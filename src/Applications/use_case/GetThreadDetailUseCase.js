class GetThreadDetailUseCase {
  constructor({
    threadRepository,
  }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCaseId) {
    return this._threadRepository.getThreadDetail(useCaseId);
  }
}

module.exports = GetThreadDetailUseCase;

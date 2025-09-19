import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils'
import QuizPlayer from '../QuizPlayer'
import { mockQuestion, mockQuiz } from '../../../test/test-utils'

// Mock the quiz hooks
const mockSubmitAnswer = vi.fn()
const mockNextQuestion = vi.fn()
const mockFinishQuiz = vi.fn()

vi.mock('../../../hooks/useQuestionMutations', () => ({
  useSubmitAnswer: () => ({
    mutate: mockSubmitAnswer,
    isPending: false,
  }),
}))

vi.mock('../../../hooks/useQuizMutations', () => ({
  useFinishQuiz: () => ({
    mutate: mockFinishQuiz,
    isPending: false,
  }),
}))

describe('QuizPlayer', () => {
  const mockProps = {
    quiz: mockQuiz,
    currentQuestion: mockQuestion,
    currentIndex: 0,
    totalQuestions: 5,
    selectedAnswers: {},
    onAnswerSelect: vi.fn(),
    onNextQuestion: mockNextQuestion,
    onFinishQuiz: vi.fn(),
    isLastQuestion: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders question and answers correctly', () => {
    render(<QuizPlayer {...mockProps} />)

    expect(screen.getByText(mockQuestion.questionText)).toBeInTheDocument()
    expect(screen.getByText('Frage 1 von 5')).toBeInTheDocument()
    
    mockQuestion.answers.forEach(answer => {
      expect(screen.getByText(answer.text)).toBeInTheDocument()
    })
  })

  it('calls onAnswerSelect when answer is clicked', () => {
    render(<QuizPlayer {...mockProps} />)

    const firstAnswer = screen.getByText(mockQuestion.answers[0].text)
    fireEvent.click(firstAnswer)

    expect(mockProps.onAnswerSelect).toHaveBeenCalledWith(
      mockQuestion.id,
      mockQuestion.answers[0].id
    )
  })

  it('shows selected answer with correct styling', () => {
    const selectedAnswers = {
      [mockQuestion.id]: mockQuestion.answers[0].id
    }

    render(
      <QuizPlayer 
        {...mockProps} 
        selectedAnswers={selectedAnswers}
      />
    )

    const selectedAnswer = screen.getByText(mockQuestion.answers[0].text)
    expect(selectedAnswer).toHaveClass('bg-indigo-100', 'border-indigo-500')
  })

  it('shows next button when answer is selected', () => {
    const selectedAnswers = {
      [mockQuestion.id]: mockQuestion.answers[0].id
    }

    render(
      <QuizPlayer 
        {...mockProps} 
        selectedAnswers={selectedAnswers}
      />
    )

    expect(screen.getByRole('button', { name: /nächste frage/i })).toBeInTheDocument()
  })

  it('calls onNextQuestion when next button is clicked', () => {
    const selectedAnswers = {
      [mockQuestion.id]: mockQuestion.answers[0].id
    }

    render(
      <QuizPlayer 
        {...mockProps} 
        selectedAnswers={selectedAnswers}
      />
    )

    const nextButton = screen.getByRole('button', { name: /nächste frage/i })
    fireEvent.click(nextButton)

    expect(mockNextQuestion).toHaveBeenCalled()
  })

  it('shows finish button on last question', () => {
    const selectedAnswers = {
      [mockQuestion.id]: mockQuestion.answers[0].id
    }

    render(
      <QuizPlayer 
        {...mockProps} 
        selectedAnswers={selectedAnswers}
        isLastQuestion={true}
      />
    )

    expect(screen.getByRole('button', { name: /quiz beenden/i })).toBeInTheDocument()
  })

  it('calls onFinishQuiz when finish button is clicked', () => {
    const selectedAnswers = {
      [mockQuestion.id]: mockQuestion.answers[0].id
    }

    render(
      <QuizPlayer 
        {...mockProps} 
        selectedAnswers={selectedAnswers}
        isLastQuestion={true}
      />
    )

    const finishButton = screen.getByRole('button', { name: /quiz beenden/i })
    fireEvent.click(finishButton)

    expect(mockProps.onFinishQuiz).toHaveBeenCalled()
  })

  it('disables buttons when submitting', () => {
    vi.mocked(require('../../../hooks/useQuestionMutations').useSubmitAnswer).mockReturnValue({
      mutate: mockSubmitAnswer,
      isPending: true,
    })

    const selectedAnswers = {
      [mockQuestion.id]: mockQuestion.answers[0].id
    }

    render(
      <QuizPlayer 
        {...mockProps} 
        selectedAnswers={selectedAnswers}
      />
    )

    const nextButton = screen.getByRole('button', { name: /nächste frage/i })
    expect(nextButton).toBeDisabled()
  })

  it('shows progress bar correctly', () => {
    render(<QuizPlayer {...mockProps} />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '1')
    expect(progressBar).toHaveAttribute('aria-valuemax', '5')
  })
})

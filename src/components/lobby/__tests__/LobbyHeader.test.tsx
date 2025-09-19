import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import LobbyHeader from '../LobbyHeader'
import { mockLobby, mockModule } from '../../../test/test-utils'

describe('LobbyHeader', () => {
  it('renders lobby information correctly', () => {
    render(<LobbyHeader lobby={mockLobby} />)

    expect(screen.getByText(mockLobby.module.title)).toBeInTheDocument()
    expect(screen.getByText(`Host: ${mockLobby.host.firstName} ${mockLobby.host.lastName}`)).toBeInTheDocument()
  })

  it('shows correct status for waiting lobby', () => {
    render(<LobbyHeader lobby={mockLobby} />)

    expect(screen.getByText('Wartend')).toBeInTheDocument()
  })

  it('shows correct status for in-progress lobby', () => {
    const inProgressLobby = { ...mockLobby, status: 'IN_PROGRESS' as const }
    render(<LobbyHeader lobby={inProgressLobby} />)

    expect(screen.getByText('Läuft')).toBeInTheDocument()
  })

  it('shows correct status for finished lobby', () => {
    const finishedLobby = { ...mockLobby, status: 'FINISHED' as const }
    render(<LobbyHeader lobby={finishedLobby} />)

    expect(screen.getByText('Beendet')).toBeInTheDocument()
  })

  it('shows correct status for cancelled lobby', () => {
    const cancelledLobby = { ...mockLobby, status: 'CANCELLED' as const }
    render(<LobbyHeader lobby={cancelledLobby} />)

    expect(screen.getByText('Abgebrochen')).toBeInTheDocument()
  })

  it('formats creation date correctly', () => {
    render(<LobbyHeader lobby={mockLobby} />)

    // The date should be formatted and displayed
    expect(screen.getByText(/erstellt am/i)).toBeInTheDocument()
  })

  it('shows participant count', () => {
    render(<LobbyHeader lobby={mockLobby} />)

    expect(screen.getByText(`${mockLobby.participants.length} Teilnehmer`)).toBeInTheDocument()
  })

  it('handles multiple participants correctly', () => {
    const multiParticipantLobby = {
      ...mockLobby,
      participants: [
        mockLobby.participants[0],
        { ...mockLobby.participants[0], id: '2', firstName: 'Jane', lastName: 'Doe' }
      ]
    }

    render(<LobbyHeader lobby={multiParticipantLobby} />)

    expect(screen.getByText('2 Teilnehmer')).toBeInTheDocument()
  })
})

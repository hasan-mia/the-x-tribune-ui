"use client";

import { useState } from "react"
import { Plus, X, Trash2, BarChart3, Clock } from "lucide-react"

interface Option {
    id: number
    text: string
    votes: number
}

interface Poll {
    id: number
    question: string
    options: Option[]
    totalVotes: number
    createdAt: string
    allowMultiple: boolean
    isActive: boolean
}

type View = "list" | "create" | "vote" | "results"

export default function PollComponent() {
    const [view, setView] = useState<View>("list")
    const [polls, setPolls] = useState<Poll[]>([
        {
            id: 1,
            question: "What's your favorite programming language?",
            options: [
                { id: 1, text: "JavaScript", votes: 45 },
                { id: 2, text: "Python", votes: 38 },
                { id: 3, text: "Java", votes: 22 },
                { id: 4, text: "C++", votes: 15 }
            ],
            totalVotes: 120,
            createdAt: "2026-01-10",
            allowMultiple: false,
            isActive: true
        }
    ])
    const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)
    const [votedPolls, setVotedPolls] = useState<Record<number, boolean>>({})

    // Create Poll State
    const [newPoll, setNewPoll] = useState({
        question: "",
        options: ["", ""],
        allowMultiple: false
    })

    const addOption = () => {
        setNewPoll({
            ...newPoll,
            options: [...newPoll.options, ""]
        })
    }

    const removeOption = (index: number) => {
        if (newPoll.options.length > 2) {
            setNewPoll({
                ...newPoll,
                options: newPoll.options.filter((_, i) => i !== index)
            })
        }
    }

    const updateOption = (index: number, value: string) => {
        const updatedOptions = [...newPoll.options]
        updatedOptions[index] = value
        setNewPoll({ ...newPoll, options: updatedOptions })
    }

    const createPoll = () => {
        if (!newPoll.question.trim() || newPoll.options.some(opt => !opt.trim())) {
            alert("Please fill in all fields")
            return
        }

        const poll = {
            id: Date.now(),
            question: newPoll.question,
            options: newPoll.options.map((text, index) => ({
                id: index + 1,
                text,
                votes: 0
            })),
            totalVotes: 0,
            createdAt: new Date().toISOString().split('T')[0],
            allowMultiple: newPoll.allowMultiple,
            isActive: true
        }

        setPolls([poll, ...polls])
        setNewPoll({ question: "", options: ["", ""], allowMultiple: false })
        setView("list")
    }

    const deletePoll = (pollId: number) => {
        if (confirm("Are you sure you want to delete this poll?")) {
            setPolls(polls.filter(p => p.id !== pollId))
        }
    }

    const togglePollStatus = (pollId: number) => {
        setPolls(polls.map(p =>
            p.id === pollId ? { ...p, isActive: !p.isActive } : p
        ))
    }

    const submitVote = (pollId: number, selectedOptions: number[]) => {
        if (selectedOptions.length === 0) {
            alert("Please select at least one option")
            return
        }

        setPolls(polls.map(poll => {
            if (poll.id === pollId) {
                const updatedOptions = poll.options.map(opt => {
                    if (selectedOptions.includes(opt.id)) {
                        return { ...opt, votes: opt.votes + 1 }
                    }
                    return opt
                })
                return {
                    ...poll,
                    options: updatedOptions,
                    totalVotes: poll.totalVotes + 1
                }
            }
            return poll
        }))

        setVotedPolls({ ...votedPolls, [pollId]: true })
        setView("results")
    }

    // Create Poll View
    if (view === "create") {
        return (
            <div className="max-w-3xl mx-auto pt-4">
                <div className="bg-white rounded-lg shadow-lg px-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Create New Poll</h2>
                        <button
                            onClick={() => setView("list")}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Poll Question
                            </label>
                            <input
                                type="text"
                                value={newPoll.question}
                                onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                                placeholder="What would you like to ask?"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Options
                            </label>
                            <div className="space-y-3">
                                {newPoll.options.map((option, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                        {newPoll.options.length > 2 && (
                                            <button
                                                onClick={() => removeOption(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addOption}
                                className="mt-3 flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                Add Option
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="allowMultiple"
                                checked={newPoll.allowMultiple}
                                onChange={(e) => setNewPoll({ ...newPoll, allowMultiple: e.target.checked })}
                                className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                            />
                            <label htmlFor="allowMultiple" className="text-sm text-gray-700">
                                Allow multiple selections
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={createPoll}
                                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium transition"
                            >
                                Create Poll
                            </button>
                            <button
                                onClick={() => setView("list")}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Vote View
    if (view === "vote" && selectedPoll) {
        const VoteView = () => {
            const [selectedOptions, setSelectedOptions] = useState<number[]>([])

            const toggleOption = (optionId: number) => {
                if (selectedPoll.allowMultiple) {
                    setSelectedOptions(prev =>
                        prev.includes(optionId)
                            ? prev.filter(id => id !== optionId)
                            : [...prev, optionId]
                    )
                } else {
                    setSelectedOptions([optionId])
                }
            }

            return (
                <div className="max-w-2xl mx-auto pt-4">
                    <div className="bg-white rounded-lg shadow-lg px-4">
                        <button
                            onClick={() => setView("list")}
                            className="text-gray-500 hover:text-gray-700 mb-4"
                        >
                            ← Back to Polls
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {selectedPoll.question}
                        </h2>

                        <div className="space-y-3 mb-6">
                            {selectedPoll.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => toggleOption(option.id)}
                                    className={`w-full text-left px-4 py-3 border-2 rounded-lg transition ${selectedOptions.includes(option.id)
                                        ? "border-red-600 bg-red-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOptions.includes(option.id)
                                            ? "border-red-600 bg-red-600"
                                            : "border-gray-300"
                                            }`}>
                                            {selectedOptions.includes(option.id) && (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                        <span className="text-gray-900">{option.text}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {selectedPoll.allowMultiple && (
                            <p className="text-sm text-gray-500 mb-4">
                                You can select multiple options
                            </p>
                        )}

                        <button
                            onClick={() => submitVote(selectedPoll.id, selectedOptions)}
                            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium transition"
                        >
                            Submit Vote
                        </button>
                    </div>
                </div>
            )
        }

        return <VoteView />
    }

    // Results View
    if (view === "results" && selectedPoll) {
        return (
            <div className="max-w-2xl mx-auto pt-4">
                <div className="bg-white rounded-lg shadow-lg px-4">
                    <button
                        onClick={() => setView("list")}
                        className="text-gray-500 hover:text-gray-700 mb-4"
                    >
                        ← Back to Polls
                    </button>

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {selectedPoll.question}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-500">
                            <BarChart3 className="w-5 h-5" />
                            <span className="text-sm">{selectedPoll.totalVotes} votes</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {selectedPoll.options.map((option) => {
                            const percentage = selectedPoll.totalVotes > 0
                                ? Math.round((option.votes / selectedPoll.totalVotes) * 100)
                                : 0

                            return (
                                <div key={option.id} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-900">{option.text}</span>
                                        <span className="text-gray-600">{percentage}% ({option.votes})</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-red-600 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    // List View (Default)
    return (
        <div className="max-w-4xl mx-auto pt-4">

            <div className="space-y-4">
                {polls.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No polls yet. Create your first poll!</p>
                    </div>
                ) : (
                    polls.map((poll) => (
                        <div key={poll.id} className="bg-white rounded-lg shadow-lg pt-4 px-4">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {poll.question}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {poll.createdAt}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BarChart3 className="w-4 h-4" />
                                            {poll.totalVotes} votes
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${poll.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                            }`}>
                                            {poll.isActive ? "Active" : "Closed"}
                                        </span>
                                    </div>
                                </div>

                            </div>

                            <div className="space-y-2 mb-4">
                                {poll.options.map((option) => (
                                    <div key={option.id} className="text-gray-700 text-sm">
                                        • {option.text}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedPoll(poll)
                                        setView(votedPolls[poll.id] ? "results" : "vote")
                                    }}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                >
                                    {votedPolls[poll.id] ? "View Results" : "Vote"}
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedPoll(poll)
                                        setView("results")
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Results
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
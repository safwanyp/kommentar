import { describe, it, expect, vi } from "vitest";
import { getApp } from "../index.js";

describe("getApp", () => {
  const mockDataStore = {
    getAllCommentsByHostId: vi.fn(),
    saveCommentByHostId: vi.fn(),
    updateCommentById: vi.fn(),
    deleteCommentById: vi.fn(),
    getCommentById: vi.fn(),
  };

  const mockEventBroker = {
    publish: vi.fn(),
    subscribe: vi.fn(),
  };

  const mockRandomId = {
    generate: vi.fn(),
  };

  const mockCacheStore = {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  };

  const mockProfanityClient = {
    check: vi.fn(),
  };

  const app = getApp({
    dataStore: mockDataStore,
    eventBroker: mockEventBroker,
    randomId: mockRandomId,
    cacheStore: mockCacheStore,
    profanityClient: mockProfanityClient,
  });

  it("should get comments for a host", async () => {
    const hostId = "host1";
    const comments = [{ id: "comment1", content: "Nice place!" }];
    mockDataStore.getAllCommentsByHostId.mockResolvedValue(comments);

    const result = await app.getCommentsForHost({ hostId });

    expect(mockDataStore.getAllCommentsByHostId).toHaveBeenCalledWith({
      hostId,
    });
    expect(result).toEqual(comments);
  });

  it("should create a comment for a host", async () => {
    const hostId = "host1";
    const content = "Great stay!";
    const savedComment = { id: "comment2", content };
    mockDataStore.saveCommentByHostId.mockResolvedValue(savedComment);

    const result = await app.createCommentForHost({ hostId, content });

    expect(mockDataStore.saveCommentByHostId).toHaveBeenCalledWith({
      hostId,
      content,
    });
    expect(result).toEqual(savedComment);
  });

  it("should update a comment by id", async () => {
    const id = "comment1";
    const content = "Updated content";
    const updatedComment = { id, content };
    mockDataStore.updateCommentById.mockResolvedValue(updatedComment);
    mockDataStore.getCommentById.mockResolvedValue({ id, content });

    const result = await app.updateCommentById({ id, content });

    expect(mockDataStore.updateCommentById).toHaveBeenCalledWith({
      id,
      content,
    });
    expect(result).toEqual(updatedComment);
  });

  it("should delete a comment by id", async () => {
    const id = "comment1";
    const content = "Nice place!";

    const savedComment = { id, content };
    mockDataStore.saveCommentByHostId.mockResolvedValue(savedComment);
    await app.createCommentForHost({ hostId: "host1", content });

    mockDataStore.deleteCommentById.mockResolvedValue(savedComment);
    mockDataStore.getCommentById.mockResolvedValue(savedComment);
    await app.deleteCommentById({ id });

    expect(mockDataStore.deleteCommentById).toHaveBeenCalledWith({ id });
  });
});

import { db } from '../firebase-admin';

export interface Story {
    id: string;
    creatorId: string;
    creatorName: string;
    teaser: string;
    category: string;
    stats: {
        views: number;
        totalEarned: number;
        giftsReceived: number;
        commentsCount?: number;
    };
    createdAt: any;
    isAnonymous?: boolean;
}

export class StoryService {
    static async getStories() {
        try {
            const snapshot = await db().collection('stories')
                .orderBy('createdAt', 'desc')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
            }));
        } catch (error) {
            console.error('[StoryService] List Error:', error);
            throw error;
        }
    }

    static async deleteStory(storyId: string) {
        try {
            await db().collection('stories').doc(storyId).delete();
            return true;
        } catch (error) {
            console.error('[StoryService] Delete Error:', error);
            throw error;
        }
    }
}

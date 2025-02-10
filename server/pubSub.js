const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub({
    projectId: 'scrollssite', 
    retry: {
        totalTimeout: 60000,
    }
});

const topicName = 'email-catalog-request';
async function publishMessage() {
    const data = JSON.stringify({ message: "Test message" });
    const dataBuffer = Buffer.from(data);
    try {
        const messageId = await pubsub.topic(topicName).publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
    } catch (error) {
        console.error(`Failed to publish message: ${error.message}`);
    }
}

publishMessage();

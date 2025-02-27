<?php
namespace JvMTECH\AIToolkit\ModelConnectors;

use Neos\Flow\Annotations as Flow;
use OpenAI;

class OpenAIModelConnector extends AbstractModelConnector
{
    public function predict(string $prompt, $attachments = []): PredictionResult
    {
        parent::predict($prompt, $attachments);

        // @todo catch errors like:
        // OpenAI\Exceptions\ErrorException
        // Rate limit reached for gpt-4 in organization org-6rKVDQ43NYjrIXn6Z7S6tsid on tokens per min (TPM): Limit 10000, Used 5654, Requested 5793.

        $client = OpenAI::client($this->configuration['apiKey']);

        $result = $client->chat()->create([
            'model' => $this->configuration['model'],
            'messages' => [
                [
                    'role' => 'user',
                    'content' => array_merge([
                        [
                            'type' => 'text',
                            'text' => $prompt,
                        ],
                    ],
                        array_map(function ($attachment) {
                            return [
                                "type" => "image_url",
                                "image_url" => [
                                    "url" => "data:" . $attachment->getMediaType() . ";base64," . base64_encode(stream_get_contents($attachment->getStream())),
                                ]
                            ];
                        }, $attachments)),
                ],
            ],
        ]);

        $text = trim($result->choices[0]->message->content, '"');

        return PredictionResult::create($text)->withTokens($result->usage->promptTokens, $result->usage->completionTokens);
    }
}

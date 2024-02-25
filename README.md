# Augmented ChatGPT
A proof-of-concept using an LLM to augment its own performance.

In a normal chat bot, you seed the model with instructions and the current 
conversation history, and it provides a (hopefully meaningful) response.

In principle, the augmented model is designed around the assumption that the 
better the prompt, the better the response.  Augment the prompt by providing the 
normal instructions, as usual, but add relevant information learned about the 
user, facts extracted from past conversations, or even snippets of past 
conversations.  Doing this will provide continuity between conversations, 
and more personalized responses.

This capability depends on automatically extracting relevant information about 
the user from their conversations and storing them in the form of a question and 
answer knowledge base.  For the sake of the POC, that database will be the
browser's IndexedDB.  This extraction is happening in the background while the
conversation is ongoing.

Note that in a production system, these knowledge base articles will be stored 
on the server, encrypted with a user-specific encryption key that is itself 
stored encrypted using a key that can only be recreated by the system using the 
user's login credentials.  This ensures absolute privacy for any stored data.  

Note also that these knowledge base articles can be used to create a fine-tuned 
model just for that user.  In theory, this can allow the knowledge base articles 
included in the fine-tuning to be excluded from model prompts, saving money on 
input tokens.  However, this POC is attempting to prove that this fine-tuning is 
not required in order to achieve the illusion of continuity between 
conversations.

Here are some of the things happening in the background during the conversation:

## Conversation Summaries

The conversation record holds summary information.  This information gets added 
to the knowledge base in a format that allows future conversations to reference 
the conversation.  When pulling back knowledge base articles, if one of those 
selected for inclusion happens to be a conversation other than the current 
conversation, then we can also pull back the portion of the conversation about 
that topic, to make it as if there is absolute continuity between conversations.

## User Data

One line of questioning will be: does the latest user prompt tell us something 
we don't know about the user?  This will be subdivided into different 
categories, such as:

* Personal information, facts, like name, age, gender, etc.
* Subjective information, like personality assessment, education/reading level, etc.
* Preferences, like level of detail, tone, etc.

Each of these extracted facts becomes a knowledge base article.  All of these 
user data related articles collectively get summarized to form the User Summary 
which gets sent as part of every prompt/response request.

## Knowledge Extraction

If the AI recognizes facts (or opinions) that are not part of its training data, 
it will be prompted to compose question and answer pairs, which get added to the 
knowledge base.  These can be about anything.

## Conversation Planning

Like user data extraction, conversation planning will ask the model a collection 
of specific questions about the conversation.  The answers to all of these 
questions will be fed back in to create a summary, and this summary will be 
added to the conversation record.  This change will NOT trigger a recalculation 
of conversation summaries or the conversation knowledge base article, as it is 
not relevant to other conversations.

## Internal Dialogue

EXPERIMENTAL IDEA:
Give the model a way to talk to itself, and respond to itself.  Possible 
responses are function calls that allow triggering knowledge base updates or 
whatever.  Plan is to see if this works and can replace the many specialized 
queries that are planned.  Or maybe just embed the output of these internal 
musings into the context so they influence response generation - that has some 
potential!

## Knowledge Review

A knowledge base article may be based on an assumption, a misunderstanding, or a 
hallucination.  We should do our due diligence to make sure that it is valid 
before we commit to referencing it in conversations.  We ask the model to verify 
that a proposed addition to the knowledge base adds value before actually adding 
it.

## Tagging

Whenever a new knowledge base article is added, it should also be tagged.  These 
tags will be included when the article is cited in a conversation context.  Tags 
serve two primary purposes:

1. flagging knowledge base items that belong in the user summary text
2. providing a friendly way of letting the user explore the knowledge base

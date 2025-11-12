<script lang="ts">
  import { createQuestionSubmission } from "$lib/polls.remote.ts";
  import { getQuestions } from "$lib/polls.remote.ts";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";

  async function createQuestionMap() {
    return getQuestions();
  }
</script>

<main>
  {#await createQuestionMap()}
    <p>Gathering Question Data...</p>
  {:then questionsMap}
    <form {...createQuestionSubmission}>
      {#each questionsMap as question}
        <Label class="text-white" for="question-{question.id}">
          {question.questionText}
        </Label>
        <input class="border text-white" {...createQuestionSubmission.fields.submissions[question.id].as("text")}/>
      {/each}
      <button type="submit" class="bg-yellow-500 text-white">Submit!</button>
    </form>
  {:catch error}
    <p>Failed to load answers...</p>
  {/await}
</main>
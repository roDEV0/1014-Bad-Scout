<script lang="ts">
  import { createQuestionSubmission } from "$lib/polls.remote.ts";
  import { getQuestions } from "$lib/polls.remote.ts";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  let demoFormat = [1];

  const questionsMap = new Map(
    (await getQuestions()).map((question) => [question.id, question]),
  );
</script>

<main class="bg-green-100">
  <form {...createQuestionSubmission}>
    <!--{#each demoFormat as question}-->
    <!--    <Label class="text-white" for="question-{questionsMap.get(question).id}">{questionsMap.get(question).questionText}</Label>-->
    <!--    <input class="border text-white" {...createQuestionSubmission.fields.submissions[question].questionAnswer.as("text")} id="question-{questionsMap.get(question).id}"/>-->
    <!--    <button class="bg-yellow-500 text-white">Submit!</button>-->
    <!--{/each}-->
    <label>
      <h2>Can you see this?</h2>
      <input {...createQuestionSubmission.fields.submissions[0].as("text")}/>
    </label>

    <button class="text-white">Submit!</button>
  </form>
</main>

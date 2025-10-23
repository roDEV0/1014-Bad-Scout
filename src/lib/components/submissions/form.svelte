<script lang="ts">
    import { createQuestionSubmission } from '$lib/polls.remote.ts'
    import { getQuestionProperties } from '$lib/polls.remote.ts'
    import { Input } from '$lib/components/ui/input'
    import { Label } from '$lib/components/ui/label'
    let demoFormat = [10, 20, 30, 40, 50]
</script>

{#each demoFormat as questionNum}
    <Label for="question-{questionNum}">{await getQuestionProperties(questionNum).question}</Label>
    <Input type="text" id="question-{questionNum}" />
{/each}
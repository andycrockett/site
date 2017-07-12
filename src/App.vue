<template>
    <div id="app">
        <div class="title">
            <div class="title-text" ref="text"></div>
            <div class="cursor"></div>
        </div>
        <div class="links">
            <a href="https://github.com/andycrockett">github</a>
            &nbsp;&middot;&nbsp;
            <a href="https://www.linkedin.com/in/andy-crockett-97695a91/">LinkedIn</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data: () => ({
            text: 'a n d y _ c r o c k e t t ;'.split(' ')
        }),
        mounted() {
            setTimeout(() => {
                this.addLetter(this.text, 0)
            }, 2000)
        },
        methods: {
            addLetter(letterArray, position) {
                let textContainer       = this.$refs.text;
                textContainer.innerText = textContainer.innerText + (letterArray[position])
                if (letterArray[position + 1]) {
                    setTimeout(() => {
                        this.addLetter(letterArray, position + 1)
                    }, Math.max(400 * Math.random(), 125))
                }
            }
        }
    }
</script>

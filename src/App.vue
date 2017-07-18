<template>
    <div id="app">
        <header>
            <div class="title">
                <a href="/" class="title-text" ref="text"></a>
                <div class="cursor"></div>
            </div>
            <div class="links">
                > <a href="https://github.com/andycrockett">github</a>
                <br/>
                > <a href="https://www.linkedin.com/in/andy-crockett-97695a91/">LinkedIn</a>
                <br/>
                > <a href="https://facebook.com/andyhcrockett">Facebook</a>
            </div>
        </header>
        <bubbles></bubbles>
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
            }, 2000);
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
            },
        }
    }
</script>

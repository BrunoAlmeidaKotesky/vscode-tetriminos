<div class="outer">
    <div class="inner">
        <div class="container">
            <slot />
        </div>
    </div>
</div>

<svelte:head>
    <style>
        .outer {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1px;
            border: 1px solid #000;
            border-radius: 4px;
            background-color: #4a5568;
        }
        .inner {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            padding: 1px;
            border: 1px solid #000;
            background-color: #f7fafc;
            border-radius: 1px;
        }
        .container {
            display: flex;
            justify-content: center;
            width: 100%;
            padding: 0.25rem;
            background-color: #000;
        }
    </style>
</svelte:head>

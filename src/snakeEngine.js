export function computeNext(params) {
    const { positions, appleX, appleY } = params;
    const head = positions[positions.length - 1];

    const nextHead = getNext(head, params);
    const newPositions = removeLast(positions);

    if (collisionExists(nextHead, newPositions)) {
        return null;
    }

    newPositions.push(nextHead);

    const [nextAppleX, nextAppleY]  = nextHead.apple
        ? generateApple(positions, params)
        : [appleX, appleY];

    return Object.assign({}, params, {
        positions: newPositions,
        appleY: nextAppleY,
        appleX: nextAppleX,
    });
}

function collisionExists(head, newPositions) {
    return newPositions.reduce((previous, point) => previous || (head.x === point.x && head.y === point.y), false)
}

function getNext(head, params) {
    const { speedX, speedY, sizeX, sizeY, appleX, appleY } = params;

    let next = {
        x: head.x + speedX,
        y: head.y + speedY,
    };

    if (next.x < 0) {
        next.x = sizeX - 1;
    }
    if (next.x >= sizeX) {
        next.x = 0;
    }
    if (next.y < 0) {
        next.y = sizeY - 1;
    }
    if (next.y >= sizeY) {
        next.y = 0;
    }
    next.apple = next.x === appleX && next.y === appleY;
    return next;
}

function removeLast(positions) {
    const last = positions[0];

    if (last.apple) {
        last.apple = false;
        return positions;
    }

    return positions.slice(1);
}

function generateApple(positions, params) {
    let nextAppleX;
    let nextAppleY;

    do {
        nextAppleY = Math.floor(Math.random() * params.sizeY);
        nextAppleX = Math.floor(Math.random() * params.sizeX);
    } while (collisionExists({ x: nextAppleX, y: nextAppleY }, positions));

    return [nextAppleX, nextAppleY];
}

export function generateGame(sizeX, sizeY) {
    const finalSizeX = Math.max(6, sizeX);
    const finalSizeY = Math.max(6, sizeY);
    const middleX = Math.floor(finalSizeX / 2);
    const middleY = Math.floor(finalSizeY / 2);

    const positions = [{ x: middleX - 2, y: middleY }, { x: middleX - 1, y: middleY }, { x: middleX, y: middleY }];

    const [appleX, appleY] = generateApple(positions, { sizeX: finalSizeX, sizeY: finalSizeY });

    return {
        positions,
        appleX,
        appleY,
        sizeY: finalSizeY,
        sizeX: finalSizeX,
        speedX: 1,
        speedY: 0,
    };
}


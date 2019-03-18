// phpschool 가위바위보
var auto_rsp = {};
auto_rsp.init = function () {
    // 남은 게임 횟수
    this.game_count = window.game_count;
    // 무승부를 제외한 진행 횟수
    this.result_count = 0;
    // 도전 포인트
    this.game_point = 50;
    // 결과 모음
    this.game_result = [];
    // 시작
    console.log('게임시작 : ' + this.game_count + '회');
    this.action();

    return "Initialize Complete";
};
auto_rsp.action = function () {
    var url = '/community/rock_paper_scissors_ajax.php';
    var data = {};
    data.user = 'R';
    data.val = this.game_point;
    $.post(url, data, $.proxy(this.response, this), 'json');
};
auto_rsp.response = function (r) {
    if (r.mode === 'safe') {
        //console.log((this.result_count+1) + '/' + this.game_count, '무!');
    } else if (r.mode === 'win') {
        ++this.result_count;
        switch (r.bonus) {
            case '1' :
                r.multiple = 1;
                break;
            case '2' :
                r.multiple = 3;
                break;
            case '3' :
                r.multiple = 2;
                break;
            case '4' :
                r.multiple = 4;
                break;
            case '5' :
                r.multiple = 1;
                break;
            case '6' :
                r.multiple = 3;
                break;
            case '7' :
                r.multiple = 2;
                break;
            case '8' :
                r.multiple = 4;
                break;
        }
        console.log(this.result_count + '/' + this.game_count, '승! ' + r.multiple + '배!');
    } else if (r.mode === 'lose') {
        ++this.result_count;
        console.log(this.result_count + '/' + this.game_count, '패!');
    } else {
        console.log('error', r);
        return;
    }
    this.game_result.push(r);

    if (this.result_count < this.game_count)
        setTimeout($.proxy(this.action, this), 1000);
    else
        this.game_end();
};
auto_rsp.game_end = function () {
    console.table(this.game_result);
    var report = {};
    report['포인트사용'] = 0;
    report['포인트획득'] = 0;
    report['포인트수익'] = 0;
    report['수익률'] = 0;
    report['게임횟수'] = 0;
    report['승'] = 0;
    report['패'] = 0;
    report['무'] = 0;
    for (var i = 0, end = this.game_result.length; i < end; ++i) {
        var row = this.game_result[i];
        if (row.mode === 'safe') {
            ++report['무'];
        } else if (row.mode === 'win') {
            ++report['승'];
            report['포인트사용'] += this.game_point;
            report['포인트획득'] += this.game_point * row.multiple;
        } else if (row.mode === 'lose') {
            ++report['패'];
            report['포인트사용'] += this.game_point;
        }
    }
    report['포인트수익'] = report['포인트획득'] - report['포인트사용'];
    report['수익률'] = Math.round(report['포인트수익'] / report['포인트사용'] * 1000) / 10;
    report['게임횟수'] = this.game_result.length - report['무'];
    report['승비율'] = Math.round(report['승'] / report['게임횟수'] * 1000) / 10;
    report['패비율'] = Math.round(report['패'] / report['게임횟수'] * 1000) / 10;

    var text = [];
    text.push('포인트사용 : ' + report['포인트사용']);
    text.push('포인트획득 : ' + report['포인트획득']);
    text.push('포인트수익 : ' + report['포인트수익']);
    text.push('수익률 : ' + report['수익률'] + '%');
    text.push('');
    text.push('시도 : ' + report['게임횟수']);
    text.push('승 : ' + report['승'] + '(' + report['승비율'] + '%)');
    text.push('패 : ' + report['패'] + '(' + report['패비율'] + '%)');
    console.log(text.join("\n"));
};
auto_rsp.init();
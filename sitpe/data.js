/* 정보처리기사 실기 — 실전 모의고사 3회분 (회차당 20문항 · 문항당 5점)
   구성: 1부 프로그래밍(C/Java/Python/SQL) 10문항 · 2부 이론 10문항
   ─ '정처기 감자' 2026년 2회 대비 압축 요약 PDF(ver 2-2, 2026.7.17)의 예상 출제 범위와 비중을 따랐습니다.
     코딩 9~11문제(C 2~4, Java 2~3, Python 2~3, SQL 2~3), 이론 9~11문제(DB / 네트워크·OS / SW개발 / SW설계 / 보안·신기술).
   엔진(assets/exam-engine.js)이 window.EXAMS 로 읽습니다. */
window.EXAMS = [];
const EXAMS = window.EXAMS;

/* ============================= 제1회 ============================= */
EXAMS.push({title:"제1회 실전 모의고사",note:"출제 확률 높은 기본기 · 표준 난이도",q:[

/* ---------- 1부 프로그래밍 ---------- */
{n:1,s:1,t:'short',q:"다음 C 프로그램의 실행 결과를 쓰시오.",
code:"#include <stdio.h>\n\nint main() {\n    int a[5] = {1, 2, 3, 4, 5};\n    int *p = a;\n    printf(\"%d \", *(p + 2));\n    printf(\"%d \", *p + 2);\n    printf(\"%d\", *(p++) + 1);\n    return 0;\n}",
blanks:[{lbl:"출력",accept:["3 3 2","332"]}],
e:"*(p+2)는 a[2]이므로 3, *p+2는 a[0]+2이므로 3입니다. *(p++)는 후위 증가라 증가 전 값인 a[0]=1을 사용하므로 1+1=2가 출력됩니다."},

{n:2,s:1,t:'short',q:"다음 C 프로그램의 실행 결과를 쓰시오.",
code:"#include <stdio.h>\n\nstruct Gamja {\n    int no;\n    char grade;\n};\n\nint main() {\n    struct Gamja g[3] = {{1, 'A'}, {2, 'B'}, {3, 'C'}};\n    struct Gamja *p = g;\n    p++;\n    printf(\"%d%c\", p->no, (*p).grade);\n    return 0;\n}",
blanks:[{lbl:"출력",accept:["2B"]}],
e:"구조체 포인터 p는 처음 g[0]을 가리키다가 p++로 g[1]로 이동합니다. p->no와 (*p).grade는 같은 표현이므로 2와 B가 출력됩니다."},

{n:3,s:1,t:'short',q:"다음 Java 프로그램의 실행 결과를 쓰시오.",
code:"class Parent {\n    int x = 10;\n    int get() { return x; }\n}\n\nclass Child extends Parent {\n    int x = 20;\n    int get() { return x; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        System.out.println(p.x + \", \" + p.get());\n    }\n}",
blanks:[{lbl:"출력",accept:["10, 20","10,20"]}],
e:"필드(변수)는 참조 변수의 타입을 따르므로 p.x는 Parent의 10입니다. 메서드는 실제 객체의 것이 호출되는 동적 바인딩이므로 p.get()은 Child의 20을 반환합니다. 이른바 '부모자식 대결' 유형입니다."},

{n:4,s:1,t:'short',q:"다음 Java 프로그램의 실행 결과를 쓰시오.",
code:"public class Main {\n    static int count = 0;\n\n    static int add(int n) {\n        count += n;\n        return count;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3, 4};\n        for (int v : arr) {\n            if (v % 2 == 0) add(v);\n        }\n        System.out.print(count);\n    }\n}",
blanks:[{lbl:"출력",accept:["6"]}],
e:"for-each로 배열을 순회하며 짝수인 2와 4만 add()에 전달됩니다. static 변수 count는 호출마다 값이 누적되어 2+4=6이 됩니다."},

{n:5,s:1,t:'short',q:"다음 Python 프로그램의 실행 결과를 쓰시오.",
code:"a = [1, 2, 3, 4, 5, 6]\nb = a[1:5:2]\nc = [x * 2 for x in a if x % 3 == 0]\nprint(b, c)",
blanks:[{lbl:"출력",accept:["[2, 4] [6, 12]","[2,4] [6,12]"]}],
e:"a[1:5:2]는 인덱스 1부터 4까지 2칸씩 건너뛰므로 [2, 4]입니다. 리스트 컴프리헨션은 3의 배수인 3과 6만 골라 2배 하므로 [6, 12]입니다."},

{n:6,s:1,t:'short',q:"다음 Python 프로그램의 실행 결과를 쓰시오.",
code:"d = {'a': 1, 'b': 2, 'c': 3}\nd['d'] = d.pop('a')\ns = set(d.values())\nprint(list(d.keys()), sum(s))",
blanks:[{lbl:"출력",accept:["['b', 'c', 'd'] 6","['b','c','d'] 6"]}],
e:"d.pop('a')는 'a'를 제거하면서 값 1을 반환하고, 그 값이 새 키 'd'에 저장됩니다. 남은 키는 삽입 순서대로 b, c, d이고 값 {2, 3, 1}의 합은 6입니다."},

{n:7,s:1,t:'short',q:"다음 C 프로그램의 실행 결과를 쓰시오.",
code:"#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[] = \"GAMJA\";\n    int len = strlen(s);\n    for (int i = 0; i < len; i++) {\n        if (i % 2 == 0) printf(\"%c\", s[i]);\n    }\n    printf(\"%d\", len);\n    return 0;\n}",
blanks:[{lbl:"출력",accept:["GMA5"]}],
e:"strlen은 널 문자를 제외한 길이 5를 반환합니다. 짝수 인덱스 0, 2, 4의 문자 G, M, A를 출력한 뒤 길이 5를 이어서 출력합니다."},

{n:8,s:1,t:'short',q:"데이터베이스 사용자에게 권한을 부여하는 DCL 명령어(1)와, 부여한 권한을 회수하는 명령어(2)를 각각 쓰시오.",
blanks:[{lbl:"(1) 부여",accept:["GRANT"]},{lbl:"(2) 회수",accept:["REVOKE"]}],
e:"DCL은 GRANT(권한 부여)와 REVOKE(권한 회수)입니다. COMMIT, ROLLBACK, SAVEPOINT는 TCL로 분류합니다."},

{n:9,s:1,t:'short',q:"아래 〈학생〉 테이블에 대해 다음 SQL을 수행했을 때 조회되는 세 값을 순서대로 쓰시오.",
code:"[학생]\n학번   이름     점수\n1      감자     90\n2      고구마   70\n3      옥수수   80\n4      당근     NULL\n\nSELECT COUNT(*), COUNT(점수), AVG(점수) FROM 학생;",
blanks:[{lbl:"COUNT(*)",accept:["4"]},{lbl:"COUNT(점수)",accept:["3"]},{lbl:"AVG(점수)",accept:["80"]}],
e:"COUNT(*)는 NULL을 포함한 전체 행이라 4, COUNT(컬럼)은 NULL을 제외하므로 3입니다. 집계 함수는 NULL을 무시하므로 평균은 240/3 = 80이며, 240/4 = 60이 아닙니다."},

{n:10,s:1,t:'short',q:"다음 C 프로그램의 실행 결과를 쓰시오.",
code:"#include <stdio.h>\n\nint f(int n) {\n    if (n <= 1) return 1;\n    return n * f(n - 2);\n}\n\nint main() {\n    printf(\"%d\", f(6));\n    return 0;\n}",
blanks:[{lbl:"출력",accept:["48"]}],
e:"f(6) = 6 × f(4) = 6 × 4 × f(2) = 6 × 4 × 2 × f(0)이고 f(0)은 1을 반환하므로 6 × 4 × 2 × 1 = 48입니다."},

/* ---------- 2부 이론 ---------- */
{n:11,s:2,t:'short',q:"ANSI/SPARC 3계층 스키마 중, 물리적 저장장치 관점에서 데이터가 실제로 저장되는 레코드 형식을 정의하는 스키마는 무엇인가?",
blanks:[{accept:["내부 스키마","내부스키마","Internal Schema"]}],
e:"외부 스키마는 사용자·개발자 관점의 뷰(서브 스키마), 개념 스키마는 조직 전체의 논리 구조, 내부 스키마는 물리적 저장 구조를 정의합니다."},

{n:12,s:2,t:'short',q:"트랜잭션의 특성(ACID) 중, 트랜잭션의 연산이 모두 반영되거나 전혀 반영되지 않아야 한다는 'All or Nothing' 성질은 무엇인가?",
blanks:[{accept:["원자성","Atomicity","원자성(Atomicity)"]}],
e:"ACID는 원자성(Atomicity), 일관성(Consistency), 고립성(Isolation), 지속성(Durability)입니다."},

{n:13,s:2,t:'short',q:"순수 관계 연산자 중 다음 기호에 해당하는 연산자의 이름을 각각 쓰시오.",
code:"(1) σ  — 주어진 조건을 만족하는 튜플(행)을 반환\n(2) π  — 지정한 속성(열)만 추출하고 중복을 제거\n(3) ÷  — B의 모든 튜플과 관계를 맺는 A의 튜플을 반환",
blanks:[{lbl:"(1) σ",accept:["셀렉트","Select","실렉트","선택"]},{lbl:"(2) π",accept:["프로젝트","Project","추출"]},{lbl:"(3) ÷",accept:["디비전","Division","나누기"]}],
e:"순수 관계 연산자는 셀렉트(σ, 수평 연산), 프로젝트(π, 수직 연산), 조인(⋈), 디비전(÷) 네 가지입니다."},

{n:14,s:2,t:'short',q:"〈수강〉 테이블이 (학번, 과목명, 교수, 성적)으로 구성되고 기본키가 (학번, 과목명)일 때, '교수'가 기본키의 일부인 과목명에만 종속되어 있다. 이러한 부분 함수 종속을 제거하는 정규화 단계는?",
blanks:[{accept:["제2정규형","2정규형","제2정규화","2NF","2정규화"]}],
e:"1NF는 원자값, 2NF는 부분 함수 종속 제거, 3NF는 이행 함수 종속 제거, BCNF는 모든 결정자가 후보키인 상태입니다."},

{n:15,s:2,t:'short',q:"OSI 7계층 중 데이터의 암호화·압축과 코드 변환을 담당하는 계층의 이름과, 네트워크 계층의 PDU 명칭을 각각 쓰시오.",
blanks:[{lbl:"암호·압축",accept:["표현 계층","표현계층","Presentation","프레젠테이션 계층","6계층"]},{lbl:"3계층 PDU",accept:["패킷","Packet"]}],
e:"암호화·압축·형식 변환은 6계층인 표현 계층의 역할입니다. PDU는 전송 계층 Segment, 네트워크 계층 Packet, 데이터 링크 계층 Frame, 물리 계층 Bit입니다."},

{n:16,s:2,t:'short',q:"192.168.10.0/24 네트워크를 FLSM 방식으로 4개의 서브넷으로 나누었다. 3번째 서브넷의 네트워크 주소와 브로드캐스트 주소를 각각 쓰시오.",
blanks:[{lbl:"네트워크",accept:["192.168.10.128"]},{lbl:"브로드캐스트",accept:["192.168.10.191"]}],
e:"4개 서브넷은 2비트를 빌려 /26이 되고 64개 단위로 나뉩니다. 1번 0~63, 2번 64~127, 3번 128~191이므로 네트워크 주소는 192.168.10.128, 브로드캐스트는 192.168.10.191입니다."},

{n:17,s:2,t:'short',q:"화이트박스 테스트의 커버리지 중, 결정문 내 개별 조건식이 독립적으로 전체 결과에 영향을 주는지를 검증하는 가장 강한 커버리지는?",
blanks:[{accept:["MC/DC","MCDC","변경 조건/결정 커버리지","Modified Condition/Decision Coverage"]}],
e:"커버리지 강도는 구문 < 결정(분기) < 조건 < 조건/결정 < MC/DC 순입니다."},

{n:18,s:2,t:'short',q:"다음 설명에 해당하는 GoF 디자인 패턴의 이름을 각각 쓰시오.",
code:"(1) 클래스의 인스턴스를 오직 하나만 생성하고 어디서든 그 객체를 참조하게 한다.\n(2) 상위 클래스는 객체 생성 인터페이스만 정의하고, 실제 생성은 서브 클래스가 담당한다.",
blanks:[{lbl:"(1)",accept:["싱글톤","Singleton","싱글턴"]},{lbl:"(2)",accept:["팩토리 메서드","팩토리메서드","Factory Method","팩토리 메소드"]}],
e:"생성 패턴은 싱글톤·팩토리 메서드·빌더·프로토타입·추상 팩토리(싱팩빌프앱)입니다."},

{n:19,s:2,t:'short',q:"모듈 내부 요소들이 단 하나의 목적을 위해 수행되는 가장 바람직한 응집도(1)와, 한 모듈이 다른 모듈의 내부 변수를 직접 참조하는 가장 나쁜 결합도(2)를 각각 쓰시오.",
blanks:[{lbl:"(1) 응집도",accept:["기능적 응집도","기능적","Functional Cohesion","기능 응집도"]},{lbl:"(2) 결합도",accept:["내용 결합도","내용","Content Coupling"]}],
e:"응집도는 기능적 > 순차적 > 통신적 > 절차적 > 시간적 > 논리적 > 우연적 순으로 강하고, 결합도는 내용 > 공통 > 외부 > 제어 > 스탬프 > 자료 순으로 강합니다. 응집도는 높고 결합도는 낮을수록 좋습니다."},

{n:20,s:2,t:'desc',q:"리팩토링(Refactoring)이 무엇인지, 목적을 포함하여 서술하시오.",
model:"소프트웨어의 외부 동작(기능과 결과)은 그대로 유지하면서 내부 구조를 개선하는 작업으로, 코드의 가독성과 유지보수성·확장성을 높이는 것이 목적이다.",
points:["외부 동작(기능) 유지","내부 구조 개선","가독성·유지보수성·확장성 향상"],
e:"'기능은 그대로, 구조만 개선'이라는 핵심 문구가 반드시 들어가야 합니다. 새 기능을 추가하거나 성능만 높이는 작업은 리팩토링이 아닙니다."}
]});

/* ============================= 제2회 ============================= */
EXAMS.push({title:"제2회 실전 모의고사",note:"계산 문항 강화 · 포인터와 스케줄링 집중",q:[

/* ---------- 1부 프로그래밍 ---------- */
{n:1,s:1,t:'short',q:"다음 C 프로그램의 실행 결과를 쓰시오.",
code:"#include <stdio.h>\n\nint main() {\n    int a = 10, b = 20;\n    int *p = &a;\n    int **pp = &p;\n\n    **pp = 30;\n    p = &b;\n    **pp += 5;\n\n    printf(\"%d %d\", a, b);\n    return 0;\n}",
blanks:[{lbl:"출력",accept:["30 25","3025"]}],
e:"처음에 **pp는 p가 가리키는 a이므로 a가 30이 됩니다. 이후 p가 b를 가리키게 되면 **pp도 b를 따라가므로 b가 20+5=25가 됩니다."},

{n:2,s:1,t:'short',q:"다음 C 프로그램의 실행 결과를 쓰시오.",
code:"#include <stdio.h>\n\nint main() {\n    int arr[3][3] = {{1,2,3},{4,5,6},{7,8,9}};\n    int sum = 0;\n    for (int i = 0; i < 3; i++)\n        sum += arr[i][2 - i];\n    printf(\"%d\", sum);\n    return 0;\n}",
blanks:[{lbl:"출력",accept:["15"]}],
e:"i가 0, 1, 2일 때 arr[0][2]=3, arr[1][1]=5, arr[2][0]=7이 더해집니다. 2차원 배열의 역대각선 합으로 3+5+7=15입니다."},

{n:3,s:1,t:'short',q:"다음 C 프로그램의 실행 결과를 쓰시오.",
code:"#include <stdio.h>\n\nint stack[5];\nint top = -1;\n\nvoid push(int x) { stack[++top] = x; }\nint pop() { return stack[top--]; }\n\nint main() {\n    push(1); push(2); push(3);\n    printf(\"%d\", pop());\n    push(4);\n    printf(\"%d\", pop());\n    printf(\"%d\", pop());\n    return 0;\n}",
blanks:[{lbl:"출력",accept:["342"]}],
e:"스택은 후입선출(LIFO)입니다. 1·2·3을 넣고 꺼내면 3, 다시 4를 넣고 꺼내면 4, 그다음 꺼내면 2가 나옵니다."},

{n:4,s:1,t:'short',q:"다음 Java 프로그램의 실행 결과를 쓰시오. (공백 포함 여부는 채점에 영향을 주지 않는다)",
code:"abstract class Shape {\n    abstract int area();\n    void print() { System.out.print(area() + \" \"); }\n}\n\nclass Rect extends Shape {\n    int w = 3, h = 4;\n    int area() { return w * h; }\n}\n\nclass Square extends Shape {\n    int s = 5;\n    int area() { return s * s; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Shape[] arr = { new Rect(), new Square() };\n        for (Shape x : arr) x.print();\n    }\n}",
blanks:[{lbl:"출력",accept:["12 25","1225"]}],
e:"추상 클래스의 print()는 추상 메서드 area()를 호출하고, 실제 객체의 구현이 실행되는 다형성이 적용됩니다. 3×4=12, 5×5=25가 차례로 출력됩니다."},

{n:5,s:1,t:'short',q:"다음 Java 프로그램의 실행 결과를 쓰시오.",
code:"public class Main {\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int sum = 0;\n        try {\n            for (int i = 0; i <= 3; i++) sum += a[i];\n        } catch (ArrayIndexOutOfBoundsException e) {\n            sum += 10;\n        } finally {\n            sum += 100;\n        }\n        System.out.print(sum);\n    }\n}",
blanks:[{lbl:"출력",accept:["116"]}],
e:"i가 0~2까지 더해져 sum은 6이 되고, i=3에서 배열 범위를 벗어나 예외가 발생해 catch에서 10이 더해져 16이 됩니다. finally는 예외 여부와 무관하게 실행되어 100이 더해져 116입니다."},

{n:6,s:1,t:'short',q:"다음 Python 프로그램의 실행 결과를 쓰시오.",
code:"def calc(*args, **kwargs):\n    total = sum(args)\n    for v in kwargs.values():\n        total -= v\n    return total\n\nprint(calc(1, 2, 3, a=2, b=1))",
blanks:[{lbl:"출력",accept:["3"]}],
e:"*args는 위치 인자를 튜플 (1,2,3)로 받아 합이 6이고, **kwargs는 키워드 인자를 딕셔너리 {'a':2,'b':1}로 받습니다. 6 − (2+1) = 3입니다."},

{n:7,s:1,t:'short',q:"다음 Python 프로그램의 실행 결과를 쓰시오.",
code:"class Gamja:\n    count = 0\n\n    def __init__(self, n):\n        self.n = n\n        Gamja.count += 1\n\n    def __str__(self):\n        return f\"G{self.n}\"\n\na = Gamja(1)\nb = Gamja(2)\nprint(a, b, Gamja.count)",
blanks:[{lbl:"출력",accept:["G1 G2 2"]}],
e:"count는 클래스 변수라 인스턴스를 만들 때마다 공유되어 증가합니다. print는 객체의 __str__ 반환값을 출력하므로 G1 G2 2가 됩니다."},

{n:8,s:1,t:'short',q:"아래 〈사원〉 테이블에 다음 SQL을 수행했을 때 조회되는 이름을 모두 쓰시오.",
code:"[사원]\n사번  이름     부서  급여\n1     감자     10    300\n2     고구마   10    500\n3     옥수수   20    400\n4     당근     20    200\n\nSELECT 이름 FROM 사원\nWHERE 급여 > (SELECT AVG(급여) FROM 사원);",
blanks:[{lbl:"이름",accept:["고구마, 옥수수","고구마 옥수수","옥수수, 고구마","옥수수 고구마"]}],
e:"서브쿼리가 먼저 실행되어 평균 급여 (300+500+400+200)/4 = 350을 구합니다. 350보다 큰 급여는 500(고구마)과 400(옥수수)입니다."},

{n:9,s:1,t:'short',q:"트랜잭션 전체를 되돌리지 않고 특정 지점까지만 취소할 수 있도록 되돌아갈 위치를 지정하는 TCL 명령어는?",
blanks:[{accept:["SAVEPOINT","세이브포인트"]}],
e:"TCL은 COMMIT, ROLLBACK, SAVEPOINT입니다. ROLLBACK TO 저장점명 형태로 부분 취소를 수행합니다."},

{n:10,s:1,t:'short',q:"다음 C 프로그램의 실행 결과를 쓰시오.",
code:"#include <stdio.h>\n#define SQ(x) x * x\n\nint main() {\n    int a = 3;\n    printf(\"%d \", SQ(a + 1));\n    printf(\"%d\", SQ(a));\n    return 0;\n}",
blanks:[{lbl:"출력",accept:["7 9","79"]}],
e:"#define은 단순 문자열 치환이므로 SQ(a+1)은 a + 1 * a + 1 로 펼쳐져 3 + 3 + 1 = 7이 됩니다. 괄호를 넣어 #define SQ(x) ((x)*(x))로 정의해야 16이 나옵니다. SQ(a)는 3*3 = 9입니다."},

/* ---------- 2부 이론 ---------- */
{n:11,s:2,t:'short',q:"메모리 프레임이 3개이고 페이지 참조 순서가 2, 3, 2, 1, 5, 2, 4일 때 LRU 알고리즘을 적용하면 페이지 부재(Page Fault)는 몇 번 발생하는가?",
blanks:[{lbl:"횟수",accept:["5","5번","5회"]}],
e:"LRU는 가장 오래 참조되지 않은 페이지를 교체합니다. 2, 3, 1, 5, 4를 적재할 때 부재가 나고 두 번째 2와 여섯 번째 2는 적중하므로 총 5회입니다. 같은 조건에서 FIFO는 6회입니다."},

{n:12,s:2,t:'short',q:"다음과 같이 프로세스가 준비 큐에 도착했을 때, 비선점형 SJF 스케줄링의 평균 대기 시간과 평균 반환 시간을 각각 쓰시오.",
code:"프로세스   도착 시간   실행 시간\n  P1          0           3\n  P2          1           1\n  P3          2           4\n  P4          3           2",
blanks:[{lbl:"평균 대기",accept:["1.75"]},{lbl:"평균 반환",accept:["4.25"]}],
e:"실행 순서는 P1(0~3) → P2(3~4) → P4(4~6) → P3(6~10)입니다. 대기 시간은 0, 2, 4, 1로 평균 1.75이고, 반환 시간은 대기+실행이므로 3, 3, 8, 3으로 평균 4.25입니다."},

{n:13,s:2,t:'short',q:"234.122.1.0/24 네트워크를 FLSM 방식으로 3개의 서브넷으로 분할할 때, 사용해야 할 CIDR 프리픽스(1)와 2번째 서브넷의 브로드캐스트 주소(2)를 쓰시오.",
blanks:[{lbl:"(1) 프리픽스",accept:["/26","26"]},{lbl:"(2) 브로드캐스트",accept:["234.122.1.127"]}],
e:"3개를 만들려면 2^n ≥ 3을 만족하는 최소 n = 2비트를 호스트에서 빌려 /26이 됩니다. 각 서브넷은 64개 단위이므로 2번째는 64~127이고 브로드캐스트는 234.122.1.127입니다."},

{n:14,s:2,t:'short',q:"HDLC 프레임의 세 종류 중, 제어부가 10으로 시작하며 오류 제어와 흐름 제어를 담당하는 프레임의 이름은?",
blanks:[{accept:["감독 프레임","S 프레임","S-프레임","감시 프레임","Supervisory","S프레임"]}],
e:"제어부가 0으로 시작하면 I(정보) 프레임, 10이면 S(감독) 프레임, 11이면 U(비번호) 프레임입니다."},

{n:15,s:2,t:'short',q:"모듈의 응집도 중 '모듈 내 요소들이 이전 요소의 출력을 다음 요소의 입력으로 사용하는' 응집도는 무엇인가?",
blanks:[{accept:["순차적 응집도","순차적","Sequential Cohesion","순차 응집도"]}],
e:"같은 입출력을 사용하면 통신적(교환적) 응집도, 출력이 다음 입력이 되면 순차적 응집도입니다."},

{n:16,s:2,t:'short',q:"UML 클래스 다이어그램에서 다음 관계의 이름을 각각 쓰시오.",
code:"(1) 점선 화살표(⇢) — 한 클래스가 짧은 시간 동안 다른 클래스를 사용하는 관계\n(2) 속이 빈 실선 화살표(─▷) — 일반적인 개념과 구체적인 개념 사이의 관계",
blanks:[{lbl:"(1)",accept:["의존","의존 관계","Dependency","의존관계"]},{lbl:"(2)",accept:["일반화","일반화 관계","Generalization","일반화관계","상속"]}],
e:"클래스 관계는 포함(◆), 집합(◇), 연관(→), 의존(⇢), 일반화(─▷), 실체화(┄▷) 여섯 가지입니다."},

{n:17,s:2,t:'short',q:"객체 지향 설계 원칙(SOLID) 중 '소프트웨어 요소는 확장에는 열려 있고 변경에는 닫혀 있어야 한다'는 원칙의 약자와 한글 명칭을 쓰시오.",
blanks:[{lbl:"약자",accept:["OCP"]},{lbl:"한글",accept:["개방-폐쇄 원칙","개방 폐쇄 원칙","개방폐쇄원칙","개방-폐쇄"]}],
e:"SOLID는 SRP(단일 책임), OCP(개방-폐쇄), LSP(리스코프 치환), ISP(인터페이스 분리), DIP(의존성 역전)입니다."},

{n:18,s:2,t:'short',q:"럼바우(Rumbaugh)의 객체 지향 분석 기법에서 사용하는 세 가지 모델링의 이름을 모두 쓰시오.",
blanks:[{lbl:"3가지",accept:["객체 모델링, 동적 모델링, 기능 모델링","객체, 동적, 기능","객체모델링 동적모델링 기능모델링","객체 동적 기능"]}],
e:"객체(정보) 모델링은 ER·객체 다이어그램, 동적 모델링은 상태 다이어그램, 기능 모델링은 자료 흐름도(DFD)를 사용합니다."},

{n:19,s:2,t:'short',q:"DES의 성능·안전성 문제를 극복하기 위해 채택된 블록 128비트의 대칭키 암호 알고리즘(1)과, 소인수분해의 어려움에 기반한 공개키 암호 알고리즘(2)을 쓰시오.",
blanks:[{lbl:"(1) 대칭키",accept:["AES"]},{lbl:"(2) 공개키",accept:["RSA"]}],
e:"대칭키 블록 암호에는 DES(64비트), AES(128비트), SEED, IDEA 등이 있고, 공개키에는 디피-헬만, RSA, ECC가 있습니다."},

{n:20,s:2,t:'desc',q:"스니핑(Sniffing)과 스푸핑(Spoofing)의 차이를 각각의 개념을 들어 서술하시오.",
model:"스니핑은 네트워크를 지나는 패킷을 몰래 가로채어 내용을 엿보는 수동적인 도청 행위이고, 스푸핑은 IP·MAC·DNS 등 신원 정보를 위조해 자신을 다른 대상인 것처럼 속이는 능동적인 위장 공격이다.",
points:["스니핑 = 패킷 도청·수동적","스푸핑 = 신원 위조·능동적","예: ARP 스푸핑, IP 스푸핑"],
e:"스니핑은 '엿듣기', 스푸핑은 '속이기'로 기억하면 됩니다. 실제 공격에서는 ARP 스푸핑으로 트래픽을 우회시킨 뒤 스니핑하는 식으로 함께 사용됩니다."}
]});

/* ============================= 제3회 ============================= */
EXAMS.push({title:"제3회 실전 모의고사",note:"자료구조·심화 문법 · 헷갈리는 개념 구분 중심",q:[

/* ---------- 1부 프로그래밍 ---------- */
{n:1,s:1,t:'short',q:"다음 C 프로그램의 실행 결과를 쓰시오.",
code:"#include <stdio.h>\n\nstruct Node {\n    int data;\n    struct Node *next;\n};\n\nint main() {\n    struct Node n3 = {3, NULL};\n    struct Node n2 = {2, &n3};\n    struct Node n1 = {1, &n2};\n\n    struct Node *p = &n1;\n    int sum = 0;\n    while (p != NULL) {\n        sum += p->data;\n        p = p->next;\n    }\n    printf(\"%d\", sum);\n    return 0;\n}",
blanks:[{lbl:"출력",accept:["6"]}],
e:"연결 리스트를 head부터 next를 따라가며 순회합니다. p가 NULL이 될 때까지 1+2+3을 더해 6이 됩니다."},

{n:2,s:1,t:'short',q:"다음 C 프로그램의 실행 결과를 쓰시오.",
code:"#include <stdio.h>\n\nint arr[5] = {1, 2, 0, 0, 0};\nint front = 0, rear = 2;\n\nint dequeue() { return arr[front++]; }\nvoid enqueue(int x) { arr[rear++] = x; }\n\nint main() {\n    dequeue();\n    enqueue(3);\n    enqueue(4);\n    printf(\"%d %d\", dequeue(), arr[rear - 1]);\n    return 0;\n}",
blanks:[{lbl:"출력",accept:["2 4","24"]}],
e:"큐는 선입선출(FIFO)입니다. 첫 dequeue로 arr[0]=1이 빠지고 front가 1이 됩니다. enqueue(3)·enqueue(4)로 arr[2]=3, arr[3]=4가 되고 rear는 4입니다. 다음 dequeue는 arr[1]=2, arr[rear-1]은 arr[3]=4입니다."},

{n:3,s:1,t:'short',q:"다음 C 프로그램의 실행 결과를 쓰시오.",
code:"#include <stdio.h>\n\nint add(int a, int b) { return a + b; }\nint mul(int a, int b) { return a * b; }\n\nint main() {\n    int (*f[2])(int, int) = {add, mul};\n    printf(\"%d\", f[1](f[0](2, 3), 4));\n    return 0;\n}",
blanks:[{lbl:"출력",accept:["20"]}],
e:"f는 함수 포인터 배열입니다. 안쪽 f[0](2,3)은 add로 5이고, 바깥 f[1](5,4)는 mul로 20입니다."},

{n:4,s:1,t:'short',q:"다음 C 프로그램의 실행 결과를 쓰시오.",
code:"#include <stdio.h>\n\nint count() {\n    static int c = 0;\n    c++;\n    return c;\n}\n\nint main() {\n    for (int i = 0; i < 3; i++) printf(\"%d\", count());\n    return 0;\n}",
blanks:[{lbl:"출력",accept:["123"]}],
e:"static 지역 변수는 한 번만 초기화되고 함수가 끝나도 값이 유지됩니다. 호출할 때마다 1, 2, 3이 반환됩니다. static이 없으면 111이 출력됩니다."},

{n:5,s:1,t:'short',q:"다음 Java 프로그램의 실행 결과를 쓰시오.",
code:"import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> list = new ArrayList<>(Arrays.asList(5, 3, 8, 1));\n        Collections.sort(list);\n        list.remove(0);\n        int sum = 0;\n        for (int v : list) sum += v;\n        System.out.print(list.get(0) + \" \" + sum);\n    }\n}",
blanks:[{lbl:"출력",accept:["3 16","316"]}],
e:"정렬 후 리스트는 [1, 3, 5, 8]입니다. remove(0)은 int 인자이므로 인덱스 0(값 1)을 제거해 [3, 5, 8]이 되고, get(0)은 3, 합은 16입니다."},

{n:6,s:1,t:'short',q:"다음 Java 프로그램의 실행 결과를 쓰시오.",
code:"class A {\n    int v;\n    A() { this(5); }\n    A(int v) { this.v = v * 2; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        A a = new A();\n        A b = new A(3);\n        System.out.print(a.v + b.v);\n    }\n}",
blanks:[{lbl:"출력",accept:["16"]}],
e:"기본 생성자는 this(5)로 다른 생성자를 호출하므로 a.v = 5×2 = 10입니다. b.v = 3×2 = 6이고, 두 값은 정수라 더해져 16이 출력됩니다."},

{n:7,s:1,t:'short',q:"다음 Python 프로그램의 실행 결과를 쓰시오.",
code:"m = [[1, 2], [3, 4], [5, 6]]\nflat = [x for row in m for x in row]\nt = [sum(row) for row in m]\nprint(flat[2:5], t)",
blanks:[{lbl:"출력",accept:["[3, 4, 5] [3, 7, 11]","[3,4,5] [3,7,11]"]}],
e:"중첩 컴프리헨션은 바깥 for부터 순서대로 읽습니다. flat은 [1,2,3,4,5,6]이고 [2:5]는 [3,4,5]입니다. 각 행의 합은 3, 7, 11입니다."},

{n:8,s:1,t:'short',q:"다음 Python 프로그램의 실행 결과를 쓰시오.",
code:"s = \"JEONGCHEOGI\"\nprint(s[::-1][:4], s.count('E'), len(set(s)))",
blanks:[{lbl:"출력",accept:["IGOE 2 8"]}],
e:"s[::-1]은 문자열을 뒤집어 'IGOEHCGNOEJ'이고 앞 4글자는 IGOE입니다. 'E'는 2번 나오고, set으로 중복을 제거하면 J·E·O·N·G·C·H·I 8개가 남습니다."},

{n:9,s:1,t:'short',q:"아래 〈주문〉 테이블에 다음 SQL을 수행했을 때, 조회되는 행의 개수(1)와 첫 번째 행의 고객명(2)을 쓰시오.",
code:"[주문]\n주문번호  고객      금액\n  1       감자      100\n  2       감자      200\n  3       고구마    150\n  4       옥수수    180\n  5       고구마     50\n\nSELECT 고객, SUM(금액) FROM 주문\nGROUP BY 고객\nHAVING SUM(금액) >= 200\nORDER BY SUM(금액) DESC;",
blanks:[{lbl:"(1) 행 수",accept:["2","2개","2행"]},{lbl:"(2) 첫 행 고객",accept:["감자"]}],
e:"고객별 합계는 감자 300, 고구마 200, 옥수수 180입니다. HAVING으로 200 미만인 옥수수가 제외되어 2행이 남고, 합계 내림차순 정렬이므로 감자(300)가 먼저 옵니다. WHERE는 행 단위, HAVING은 그룹 단위 조건입니다."},

{n:10,s:1,t:'short',q:"테이블의 구조는 그대로 두고 모든 행을 빠르게 삭제하며, 롤백이 불가능한 DDL 명령어는?",
blanks:[{accept:["TRUNCATE","TRUNCATE TABLE"]}],
e:"DELETE는 DML이라 조건을 줄 수 있고 롤백이 가능하지만, TRUNCATE는 DDL이라 전체 행을 즉시 삭제하고 되돌릴 수 없습니다. DROP은 테이블 구조까지 삭제합니다."},

/* ---------- 2부 이론 ---------- */
{n:11,s:2,t:'short',q:"다음 설명에 해당하는 GoF 디자인 패턴의 이름을 각각 쓰시오.",
code:"(1) 한 객체의 상태가 변하면 그 객체에 의존하는 다른 객체들에게 자동으로 통보되어 갱신된다.\n(2) 서로 호환되지 않는 인터페이스를 가진 클래스들을 함께 동작할 수 있도록 변환해 준다.",
blanks:[{lbl:"(1)",accept:["옵서버","Observer","옵저버","감시자"]},{lbl:"(2)",accept:["어댑터","Adapter"]}],
e:"옵서버는 행위 패턴(발행/구독), 어댑터는 구조 패턴입니다. 구조 패턴은 어댑터·데코레이터·퍼사드·프록시·브리지·플라이웨이트·컴포지트입니다."},

{n:12,s:2,t:'short',q:"아래 모듈 구조에서 모듈 F를 기준으로 한 Fan-In과 Fan-Out의 값을 각각 쓰시오.",
code:"모듈 A, B, C가 각각 모듈 F를 호출한다.\n모듈 F는 모듈 G와 모듈 H를 호출한다.",
blanks:[{lbl:"Fan-In",accept:["3"]},{lbl:"Fan-Out",accept:["2"]}],
e:"Fan-In은 자신을 호출하는 상위 모듈 수(들어오는 화살표), Fan-Out은 자신이 호출하는 하위 모듈 수(나가는 화살표)입니다."},

{n:13,s:2,t:'short',q:"블랙박스 테스트 기법 중, 입력값을 유효/무효 그룹으로 나누는 기법(1)과 그 그룹의 경계에 있는 값을 집중적으로 테스트하는 기법(2)의 이름을 쓰시오.",
blanks:[{lbl:"(1)",accept:["동등 분할","동치 분할","등가 분할","Equivalence Partitioning","동등분할"]},{lbl:"(2)",accept:["경곗값 분석","경계값 분석","경계값분석","Boundary Value Analysis","경계 값 분석"]}],
e:"동등 분할로 그룹을 나눈 뒤, 오류가 자주 발생하는 경계에서 값을 뽑는 경곗값 분석을 함께 사용합니다."},

{n:14,s:2,t:'short',q:"테스트 하네스 구성 요소 중, 상향식 통합 테스트에서 아직 개발되지 않은 상위 모듈 역할을 하는 것(1)과, 하향식 통합 테스트에서 하위 모듈 역할을 하는 것(2)을 쓰시오.",
blanks:[{lbl:"(1) 상향식",accept:["테스트 드라이버","드라이버","Test Driver","Driver"]},{lbl:"(2) 하향식",accept:["테스트 스텁","스텁","Test Stub","Stub"]}],
e:"상향식은 아래에서 위로 올라가므로 위쪽을 대신할 드라이버가, 하향식은 위에서 아래로 내려가므로 아래를 대신할 스텁이 필요합니다."},

{n:15,s:2,t:'short',q:"라우팅 프로토콜 RIP이 사용하는 알고리즘(1)과 OSPF가 사용하는 알고리즘(2)을 쓰시오.",
blanks:[{lbl:"(1) RIP",accept:["벨만-포드","벨만포드","Bellman-Ford","거리 벡터","거리벡터"]},{lbl:"(2) OSPF",accept:["다익스트라","Dijkstra","링크 상태","링크상태"]}],
e:"RIP은 거리 벡터(벨만-포드)로 홉 수 기준 최단 경로를, OSPF는 링크 상태(다익스트라)로 비용 기준 최단 경로를 계산합니다."},

{n:16,s:2,t:'short',q:"공격 대상 집단이 자주 방문하는 웹사이트를 미리 감염시켜 두고, 그 사이트에 접속한 대상이 악성코드에 감염되도록 하는 사회공학 공격 기법은?",
blanks:[{accept:["워터링 홀","워터링홀","Watering Hole","워터링 홀 공격"]}],
e:"물웅덩이에서 먹잇감을 기다리는 포식자에서 유래했습니다. 사전 정찰 후 맞춤형 메일을 보내는 것은 스피어 피싱, 오타 도메인을 이용하는 것은 타이포스쿼팅입니다."},

{n:17,s:2,t:'short',q:"클라우드 컴퓨팅 서비스 유형 중, 애플리케이션을 개발하고 관리할 수 있는 플랫폼(개발 환경)을 서비스로 제공하는 것은?",
blanks:[{accept:["PaaS","Platform as a Service"]}],
e:"IaaS는 서버·스토리지 같은 인프라, PaaS는 개발 플랫폼, SaaS는 소프트웨어 자체를 제공합니다."},

{n:18,s:2,t:'short',q:"소프트웨어 개발 보안 취약점 중, 버퍼의 경계 검사를 하지 않아 할당된 메모리 범위를 넘어 데이터를 덮어쓰게 되는 취약점은?",
blanks:[{accept:["버퍼 오버플로우","버퍼오버플로우","Buffer Overflow","버퍼 오버플로","버퍼넘침"]}],
e:"안전한 문자열 함수 사용, 입력 길이 검증, 스택 카나리(Canary)·ASLR·DEP 등으로 대응합니다."},

{n:19,s:2,t:'short',q:"접근 통제 방식 중, 사용자의 신분(식별자)을 기준으로 자원 소유자가 자신의 판단에 따라 권한을 부여하는 방식(1)과, 중앙에서 규칙에 따라 강제로 통제하는 방식(2)의 약어를 쓰시오.",
blanks:[{lbl:"(1)",accept:["DAC","임의적 접근 통제"]},{lbl:"(2)",accept:["MAC","강제적 접근 통제"]}],
e:"DAC는 임의적(신분 기반), MAC은 강제적(규칙 기반), RBAC은 역할 기반 접근 통제입니다."},

{n:20,s:2,t:'desc',q:"업무 연속성 계획에서 사용하는 RTO와 RPO의 의미와 차이를 서술하시오.",
model:"RTO(Recovery Time Objective)는 장애 발생 후 시스템을 정상 가동할 때까지 허용되는 목표 복구 시간이고, RPO(Recovery Point Objective)는 복구했을 때 허용할 수 있는 데이터 손실의 시점 또는 양으로 백업 주기를 정하는 기준이 된다. 즉 RTO는 '얼마나 빨리 복구하는가', RPO는 '얼마만큼의 데이터를 잃어도 되는가'를 정한다.",
points:["RTO = 목표 복구 시간","RPO = 허용 데이터 손실 시점/양","RPO는 백업 주기 산정 기준"],
e:"RTO는 시간축의 '앞으로', RPO는 '뒤로' 생각하면 구분이 쉽습니다. 두 값은 BCP(업무 연속성 계획)와 DRP(재해 복구 계획) 수립의 핵심 지표입니다."}
]});

Pocci Account Center 1.0
========================

事前準備
--------

### 事前準備
1.  以下のスクリプトを実行してユーザー登録をする。
    ```
    function add_user() {
        SN=`echo $1 | cut -d@ -f1`
        GN=${SN}_GN
        curl http://localhost:9898/save -X POST -H 'Content-Type: application/json' -d \
         '{
            "cn":"admin",
            "userPassword":"admin",
            "user":{
              "cn": "'$SN'",
              "userPassword": "password",
              "sn": "'$SN'",
              "givenName": "'$GN'",
              "displayName": "'$SN,$GN'",
              "mail": "'$1'",
              "labeledURI": ""
            }
          }'
    }

    add_user a01@example.com
    add_user a02@example.com
    add_user a13@example.com
    add_user a14@example.com
    add_user a15@example.com
    add_user b06@example.com
    add_user b07@example.com
    add_user b18@example.com
    add_user b19@example.com
    add_user b2x@example.com
    add_user b2y@example.com
    add_user b2z@example.com
    ```


一般ユーザーによる属性変更
--------------------------
一般ユーザーが自分の属性 (パスワードや表示名など) を変更できるようにする

### ログイン
1.  アプリケーションのURLにアクセスすると、ユーザーID、パスワードの入力ダイアログが表示されること。
    *   User Id にフォーカスがあること
1.  存在しないユーザーID、パスワードを入力して、「Login」をクリックすると、
    再度入力ダイアログが表示されること。
1.  存在する一般ユーザーのユーザーID、パスワードを入力して、「Login」をクリックすると、
    そのユーザーの情報が表示されること。
    *   User Id, Password, Last Name, First Name, Display Name, Email, Avatar URL 項目が表示されること。
    *   Password にカーソルがあること
    *   User Id は入力不可になっていること。
    *   ボタンは「Save」のみが表示され、「Delete」は表示されていないこと。
    *   検索入力領域は表示されないこと。

### 属性変更
1.  全項目を埋め、Password 項目のみを未入力して、Saveをクリックすると、
    Password 項目の未入力エラーが表示されること。
1.  全項目を埋め、Last Name 項目のみを未入力して、Saveをクリックすると、
    Last Name 項目の未入力エラーが表示されること。
1.  全項目を埋め、First Name 項目のみを未入力して、Saveをクリックすると、
    First Name 項目の未入力エラーが表示されること。
1.  全項目を埋め、Display Name 項目のみを未入力して、Saveをクリックすると、
    Display Name 項目の未入力エラーが表示されること。
1.  全項目を埋め、Email 項目のみを未入力して、Saveをクリックすると、
    Email 項目の未入力エラーが表示されること。
1.  全項目を埋め、Email 項目に "aaa" と入力して、Saveをクリックすると、
    Email 項目の入力形式エラーが表示されること。
1.  全項目を埋め、Avatar URL 項目に "aaa" と入力して、Saveをクリックすると、
    Avatar URL 項目の入力形式エラーが表示されること。
1.  全項目を正しい形式で変更しSaveボタンをクリックすると正常終了すること。
    *   ログインダイアログが表示されること
1.  全項目を正しい形式で埋め、Avatar URL 項目のみを未入力にして、
    Saveをクリックすると正常終了すること。
    *   ログインダイアログが表示されること

### ログアウト
1.  画面右上の Logout ボタンをクリックすると、
    ユーザーID、パスワードの入力ダイアログが表示されること。
1.  そのまま、直前に使用したユーザーIDでログインして、画面を表示した際、
    直前に入力したデータが再表示されること。
1.  全項目を変更せずにそのまま Save ボタンをクリックしてもエラー発生しないこと。
    *   そのまま再ログインできること


管理者によるユーザー管理
------------------------
管理者が、ユーザーの追加、削除、属性変更を行えるようにする


### ログイン
1.  ユーザーIDを admin と入力し、admin のパスワードを入力して、「Login」をクリックすると、
    管理者用画面が表示されること。
    *   Search にカーソルがあること
    *   Search の下には、10人分のユーザーIDが一覧表示されること
    *   一覧は cn のアルファベット順でソートされていること
    *   User Id, Password, Last Name, First Name, Display Name, Email, Avatar URL 項目が表示されること。
    *   ただし、これらの項目はすべて未入力になっていること。
    *   User Id は入力不可になっていること。
    *   ボタンは「Save」のみが表示され、「Delete」は表示されていないこと。

### 検索
1.  Search に `b` と入力すると、`b` を含む項目に一覧が絞り込まれること
1.  続けて '1' を入力すると 'b1' でさらに絞り込みが行われること
1.  ×ボタンをクリックすると、入力項目の文字列が消えて、先頭から10人分の一覧が表示されること
1.  Search項目に入力された文字列が既存の cn と一致しない場合、
    「New User」ボタンが自動で表示されること
1.  Search項目に「admin」と入力した場合、「New User」ボタンは表示されないこと
1.  ×ボタンをクリックすると、入力項目の文字列が消えて、先頭から10人分の一覧が表示されること

### 既存ユーザーの属性変更
1.  検索結果一覧の `a01` をクリックすると、右側の属性情報が表示されること
    *   必ず全項目が表示されること。
    *   SaveボタンとDeleteボタンの両方が表示されていること。
1.  以下の内容を入力してSaveボタンをクリックすると、
    全入力項目がクリアされ、Searchにカーソルが移ること
    ```
    Password: abcd
    Last Name: A01
    First Name: A01_GN
    Display Name: A01,A01_GN
    Email: a01@example.com
    Avatar URL: http://a01.example.com/
    ```
1.  検索一覧の中から、一旦別ユーザ `a02` をクリックし、
    再度先程のユーザー `a01` をクリックしても
    先程Saveした変更が保持されていること

### 既存ユーザーの削除
1.  検索結果一覧の中の `a01` クリックすると、右側に属性情報とDELETEボタン表示されること
1.  DELETEボタンをクリックすると、確認ダイアログがでること
1.  確認ダイアログでキャンセルすると何も起こらないこと
1.  確認ダイアログでOKすると、該当ユーザーが削除されること
    *   すべての入力項目がクリアされること
    *   検索結果一覧に表示されなくなること
    *   Searchにカーソルが移動すること

### 新規ユーザーの追加
1.  Search項目に `a01` と入力し、New User をクリックすると、新規ユーザー追加可能になること
    *   Search項目の入力値 `a01` が User Id に自動転記されること
    *   User Id は入力不可状態であること
    *   その他の項目は未入力状態になること
    *   Saveボタンが表示されること
    *   Deleteボタンは表示されないこと
1.  Display Name を未入力の状態で Last Name および First Name を入力すると、
    自動的に Display Name が入力されること
1.  Display Name が入力済みの状態で Last Name および First Name を入力しても、
    Display Name は変更されないこと
1.  全項目を埋め、Email 項目に "aaa" と入力して、Saveをクリックすると、
    Email 項目の入力形式エラーが表示されること。
1.  全項目を妥当な形式で埋め、Saveボタンをクリックすると正常終了すること
    *   登録したユーザーが検索結果一覧に表示されていること
1.  検索結果一覧から新規登録したユーザー `a01` をクリックすると、
    先ほど登録した内容が表示されること

### ログアウト
1.  画面右上の Logout ボタンをクリックすると、
    ユーザーID、パスワードの入力ダイアログが表示されること。
